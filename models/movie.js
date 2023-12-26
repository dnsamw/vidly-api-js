const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const Joi = require("joi");

function validateMovie(movie) {
  const movieJoiSchema = Joi.object({
    title: Joi.string().min(3).required(),
    genreId: Joi.objectId().required(), // this is important.
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
  });

  return movieJoiSchema.validate(movie);
}

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 255,
  },
  genre: { type: genreSchema, required: true },
  numberInStock: { type: Number, required: true, min: 0, max: 255 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = { Movie, movieSchema, validateMovie };
