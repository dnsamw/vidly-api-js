const helmet = require("helmet");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const log = require("./middleware/logger");

const rootRoutes = require("./routes/root");
const customersRoutes = require("./routes/customers");
const genresRoutes = require("./routes/genres");
const moviesRoutes = require("./routes/movies");
const rentalsRoute = require("./routes/rentals");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");

dotenv.config();
console.log("JWT KEY :", process.env.jwtPrivateKey);
if (!process.env.jwtPrivateKey) {
  console.error("FATAL ERROR", "jwtPrivateKey is not defined!");
  process.exit(1);
}
const app = express();

app.use(express.json());
app.use(log);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

//Establish a connection with Monogo DB
mongoose
  .connect(process.env.MONGODB_CON_STRING)
  .then(() => console.log("Connected to mongoDB.."))
  .catch((err) => console.log("MongoDB connection failed", err));

app.use("/", rootRoutes);
app.use("/api/genres", genresRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/rentals", rentalsRoute);
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is listenting on http://localhost:${port}`);
  console.log(`Environment : ${app.get("env")}`);
});
