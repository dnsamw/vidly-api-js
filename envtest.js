// test.js
require("dotenv").config();
const config = require("config");

console.log(config.get("port"));
