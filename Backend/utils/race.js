const crypto = require("crypto");
const Paragraph = require("../models/paragraphs");
const User = require("../models/user");

const lobbies = [];

function getLobby(lobbyId) {
  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);

  return lobby;
}

function updateLobby(lobbyId, socketId, wpm, percentage) {
  // First we find the lobby user is connected
  const lobby = getLobby(lobbyId);

  // Then finding the player using the socket
  const player = lobby.players.find((player) => player.socketId === socketId);

  // Updating the player's wpm
  player.wpm = wpm;
  player.percentageCompleted = percentage;
}

function createLobby() {
  const lobby = {
    id: crypto.randomUUID().toString(),
    players: [],
    state: "waiting", // three states ('waiting', 'in_progress', 'finished')
  };

  lobbies.push(lobby);
  return lobby;
}

function joinLobby(playerId, socket, io) {
  return new Promise((resolve, reject) => {
    let lobby = lobbies.find((lobby) => lobby.state === "waiting");

    // If there is no lobby in waiting state
    if (!lobby) {
      lobby = createLobby();
    }

    User.findById(playerId)
      .then((user) => {
        if (!user) throw new Error("User not found");

        const player = {
          playerId: playerId,
          socketId: socket.id,
          username: user.name,
          email: user.email,
          profilePic: user.profilePic,
          percentageCompleted: 0,
          wpm: 0,
        };
        lobby.players.push(player);
        socket.join(lobby.id);

        resolve(lobby);
      })
      .catch((error) => {
        console.log("Internal error: " + error);
        reject(error);
      });
  });
}

async function fetchQuote() {
  const result = await Paragraph.aggregate([
    {
      $project: {
        quotesCount: { $size: "$genre.quotes" },
      },
    },
  ]);
  const { quotesCount } = result[0];
  const randomValue = Math.floor(Math.random() * quotesCount);

  const quotes = await Paragraph.aggregate([
    { $unwind: "$genre.quotes" },
    { $skip: randomValue },
    { $limit: 1 },
  ]);

  const quote = quotes[0].genre.quotes;
  console.log(quote);
  return quote;
}

function disconnectUser(socketId) {
  lobbies.forEach((lobby, index) => {
    if (lobby.state === "waiting" || lobby.state === "in-progress") {
      const idx = lobby.players.findIndex(
        (player) => player.socketId === socketId
      );

      if (idx !== -1) {
        lobby.players.splice(idx, 1);
        // console.log("Lobby after disconnectin:", lobby);
      }

      if (lobby.players.length === 0) {
        lobbies.splice(index, 1);
        console.log("Lobbies after disconneting:", lobbies);
      }
    }
  });
}

module.exports = {
  createLobby,
  joinLobby,
  fetchQuote,
  getLobby,
  updateLobby,
  disconnectUser,
};
