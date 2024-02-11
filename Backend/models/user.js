const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  raceDetail: {
    wins: {
      type: Number,
    },
    loses: {
      type: Number,
    },
    avgSpeed: {
      type: Number,
    },
    maxSpeed: {
      type: Number,
    },
    races: {
      type: Number,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
