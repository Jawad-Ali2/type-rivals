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
    },
  ],
  state: String,
  expiresAt: { type: Date, default: Date.now, expires: 3600 },
});

// TTL indexing for auto expiry of lobby
lobbySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // 1 means to sort in ascending order

module.exports = mongoose.model("Lobby", lobbySchema);
// const player = {
//   playerId: playerId,
//   socketId: socket.id,
//   username: user.name,
//   email: user.email,
//   profilePic: user.profilePic,
//   wpm: 0,
// };
// const lobby = {
//   id: crypto.randomUUID().toString(),
//   players: [],
//   state: "waiting", // three states ('waiting', 'in_progress', 'finished')
// };
