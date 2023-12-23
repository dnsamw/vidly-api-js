const express = require("express");
const router = express.Router();

const { Genre, validateGenre } = require("../models/genre");

//get genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  if (!genres) {
    res.status(404).send("Not found");
    return;
  }
  res.status(200).send(genres);
});

//get a genre by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const genre = await Genre.findById(id);
    if (!genre) {
      res.status(404).send("Not found");
      return;
    }
    res.status(200).send(genre);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//post a new genre
router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });

  try {
    const result = await genre.save();
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
});

//update a genre by id
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { error } = validateGenre(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  try {
    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).send("Genre not found");

    genre.name = req.body.name;
    const result = await genre.save();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//delete a genre by id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const genre = await Genre.findById(id);
    if (!genre) {
      res.status(404).send("Not found!");
      return;
    }

    const result = await Genre.deleteOne({ _id: id });
    if (result.deletedCount > 0) {
      res.status(201).send(genre);
    } else {
      res.status(404).send("Not found!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
