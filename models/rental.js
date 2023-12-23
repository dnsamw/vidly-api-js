const mongoose = require("mongoose");
const Joi = require("joi");
const { movieSchema } = require("./movie");
const { customerSchema } = require("./customer");

function validateRental(rental) {
  const rentalJoiSchema = Joi.object({
    movieId: Joi.string().required(), // this is important.
    customerId: Joi.string().required(),
  });

  return rentalJoiSchema.validate(rental);
}

const rentalSchema = new mongoose.Schema({
  movie: { type: movieSchema, requird: true },
  customer: { type: customerSchema, required: true },
});

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = { Rental, validateRental, rentalSchema };
