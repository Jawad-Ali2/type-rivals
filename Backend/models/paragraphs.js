const mongoose = require("mongoose");

const { Schema } = mongoose;

const paragraphSchema = new Schema({
  genre: {
    quotes: {
      type: String,
      author: String,
      speech: {
        type: String,
      },
    },
    jokes: {
      type: String,
      speech: {
        type: String,
      },
    },
  },
});

module.exports = mongoose.model("Paragraph", paragraphSchema);
