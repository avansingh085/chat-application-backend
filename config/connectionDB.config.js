const mongoose = require("mongoose");
const dotenv = require("dotenv");
const {MONGO_URI}=require('./server.config');
dotenv.config();

const ConnectionDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB");
    console.log(error);
  }
};
module.exports = ConnectionDB;