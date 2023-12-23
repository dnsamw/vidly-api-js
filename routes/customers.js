const express = require("express");
const router = express.Router();

const { Customer, validateCustomer } = require("../models/customer");

// Get all customers
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  if (customers.length <= 0) {
    res.status(404).send("Not found");
    return;
  }
  res.status(200).send(customers);
});

// Get a customer by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      res.status(404).send("Not found");
      return;
    }
    res.status(200).send(customer);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Create a customer
router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  try {
    const result = await customer.save();
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
});

// Update a customer by id
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await Customer.findById(id);
    if (!customer) return res.status(400).send("Not Found");

    customer.name = req.body.name;
    customer.isGold = req.body.isGold;
    customer.phone = req.body.phone;

    const result = await customer.save();
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete a customer by id
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      res.status(404).send("Not found!");
      return;
    }

    const result = await Customer.deleteOne({ _id: id });
    if (result.deletedCount > 0) {
      res.status(201).send(customer);
    } else {
      res.status(404).send("Not found!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
