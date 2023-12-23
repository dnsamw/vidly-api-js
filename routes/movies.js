const express = require("express");
const router = express.Router();

const { Movie, movieSchema, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");

//get all
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort("title");
    if (!movies) return res.status(404).send("No movies found.");
    res.status(200).send(movies);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//get one
router.get("/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).send("Movie not found.");
    res.status(200).send(movie);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//post a new genre
router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = new Movie({
      title: req.body.title,
      numberInStock: parseInt(req.body.numberInStock),
      dailyRentalRate: parseInt(req.body.dailyRentalRate),
      genre: {
        _id: genre._id,
        name: genre.name,
      },
    });

    const result = await movie.save();
    res.status(201).send(result);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//update a movie
router.put("/:id", async (req, res) => {
  const movieId = req.params.id;
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).send("Movie not found");

    movie.title = req.body.title;
    movie.genre._id = genre._id;
    movie.genre.name = genre.name;
    movie.numberInStock = req.body.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate;

    const result = await movie.save();
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//delete one
router.delete("/:id", async (req, res) => {
  const movieId = req.params.id;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).send("Movie not found");

    const result = await Movie.deleteOne({ _id: movieId });
    if (result.deletedCount > 0) {
      res.status(201).send(movie);
    } else {
      res.status(404).send("Not found!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
