const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");

//login user

router.post("/", async (req, res) => {
  const { error } = validateAuthRequest(req.body);
  if (error) return res.status(400).send("Invalid email or password");
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res.send(token);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

function validateAuthRequest(user) {
  const userJoiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  });

  return userJoiSchema.validate(user);
}

module.exports = router;
