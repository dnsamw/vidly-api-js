const Joi = require("joi");
const mongoose = require("mongoose");

function validateGenre(genre) {
  const genreSchema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return genreSchema.validate(genre);
}

// Create a model form the schema
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
    trim: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

module.exports = { Genre, genreSchema, validateGenre };
