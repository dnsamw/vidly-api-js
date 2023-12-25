const express = require("express");
const { validateRental, Rental, rentalSchema } = require("../models/rental");
const router = express.Router();
// const mongoose = require("mongoose");
// const Fawn = require("fawn");

const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");

// Fawn.init(mongoose);

//get all
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  if (!rentals) return res.status(403).send("Rentals not found.");
  res.status(200).send(rentals);
});

//post a rental
router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send("Invalid customer.");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid movie.");

    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
        genre: {
          _id: movie.genre._id,
          name: movie.genre.name,
        },
      },
    });

    if (movie.numberInStock !== 0) {
      //!!! Here transactions or two phase commits has to be implemented !!
      movie.numberInStock--;
      const updatedMovie = movie.save();
      if (!updatedMovie) return res.status(400).send("movie update failed.");

      const updatedRental = await rental.save();
      res.status(201).send(updatedRental);

      TRANSACTION;
      new Fawn.Task()
        .save("rentals", rental)
        .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
        .run();
    } else {
      res.status(403).send("Movies is out of stock!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
