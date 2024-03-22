const { Schema } = require("mongoose");

const lobbySchema = new Schema({
  lobby: {
    players: [
      {
        playerId: String,
        socketId: String,
        username: String,
        email: String,
        profilePic: String,
        wpm: Number,
      },
    ],
    state: String,
  },
});

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
