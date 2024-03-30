const mongoose = require("mongoose");

const { Schema } = mongoose;

const lobbySchema = new Schema({
  players: [
    {
      playerId: String,
      socketId: String,
      username: String,
      email: String,
      profilePic: String,
      percentageCompleted: Number,
      wpm: Number,
      userLeft: Boolean,
      completionTime: String,
    },
  ],
  state: String,
  expiresAt: { type: Date, default: Date.now, expires: 3600 },
});

// TTL indexing for auto expiry of lobby
lobbySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // 1 means to sort in ascending order

module.exports = mongoose.model("Lobby", lobbySchema);
