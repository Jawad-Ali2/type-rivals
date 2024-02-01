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
  raceDetail: [
    {
      wins: {
        type: Number,
        required: true,
      },
      loses: {
        type: Number,
        required: true,
      },
      avgSpeed: {
        type: Number,
        required: true,
      },
      maxSpeed: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
