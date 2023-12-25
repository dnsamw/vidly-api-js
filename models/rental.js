const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

function validateRental(rental) {
  const rentalJoiSchema = Joi.object({
    movieId: Joi.string().required(), // this is important.
    customerId: Joi.string().required(),
  });

  return rentalJoiSchema.validate(rental);
}

const rentalSchema = new mongoose.Schema({
  movie: new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 255,
    },
    genre: { type: genreSchema, required: true },
    dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
  }),
  customer: new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 255,
      trim: true,
    },
    isGold: { type: Boolean, default: false },
    phone: { type: String, required: true, minLength: 10 },
  }),
  dateOut: { type: Date, required: true, default: Date.now },
  dateReturend: { type: Date },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = { Rental, validateRental, rentalSchema };
