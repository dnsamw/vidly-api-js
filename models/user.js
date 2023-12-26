const mongoose = require("mongoose");
const Joi = require("joi");

function validateUser(user) {
  const userJoiSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  return userJoiSchema.validate(user);
}

const userSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, maxLength: 255, required: true },
  email: {
    type: String,
    minLength: 3,
    maxLength: 255,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024,
    required: true,
    select: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User, validateUser, userSchema };
