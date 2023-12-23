const Joi = require("joi");
const mongoose = require("mongoose");

function validateCustomer(customer) {
  const customerSchema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().min(3).max(255).required(),
    phone: Joi.string().min(10).required(),
  });

  return customerSchema.validate(customer);
}

//create a mongoose model

const customerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255,
    trim: true,
  },
  isGold: { type: Boolean, default: false },
  phone: { type: String, required: true, minLength: 10 },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = { Customer, validateCustomer, customerSchema };
