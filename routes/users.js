const express = require("express");
const _ = require("lodash");
const { User, validateUser, userSchema } = require("../models/user");
const router = express.Router();

// Register new user
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // see if a user is already exists by the give email

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exists!");

    user = new User(_.pick(req.body, ["name", "email", "password"]));
    await user.save();

    res.status(201).send(_.pick(user, ["_id", "name", "email"]));
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//get all
router.get("/", async (req, res) => {
  try {
    const result = await User.find();
    res.status(200).send(result);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//get one by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await User.findById(id);
    if (!result) return res.status(404).send("User not found!");
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//update one by id
router.put("/:id", async (req, res) => {
  const id = req.params.id;

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true }
    );
    res.status(201).send(updatedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
