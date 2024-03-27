const crypto = require("crypto");
const Paragraph = require("../models/paragraphs");
const User = require("../models/user");
const Lobby = require("../models/lobby");

const lobbies = [];

function getLobby(lobbyId) {
  // const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  return new Promise((resolve, reject) => {
    Lobby.findById(lobbyId)
      .then((lobby) => {
        resolve(lobby);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function switchLobbyState(lobbyState, lobbyId) {
  const lobby = await Lobby.findById(lobbyId);
  lobby.state = lobbyState;

  await lobby.save();
}

function updateLobby(lobbyId, socketId, wpm, percentage) {
  // First we find the lobby user is connected
  getLobby(lobbyId)
    .then((lobby) => {
      // Then finding the player using the socket
      const player = lobby.players.find(
        (player) => player.socketId === socketId
      );

      // Updating the player's wpm
      player.wpm = wpm;
      player.percentageCompleted = percentage;
    })
    .catch((error) => {
      console.error(error);
    });
}

function createLobby() {
  return new Promise((resolve, reject) => {
    const lobby = new Lobby({
      players: [],
      state: "waiting", // three states ('waiting', 'in_progress', 'finished')
    });

    lobby
      .save()
      .then((lobby) => {
        resolve(lobby);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function joinLobby(playerId, socket, io) {
  return new Promise(async (resolve, reject) => {
    let lobby = await Lobby.findOne({ state: "waiting" });

    if (!lobby) lobby = await createLobby();
    console.log(lobby.players, lobby.state);

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
        return lobby.save();
      })
      .then((lobby) => {
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
  return new Promise((resolve, reject) => {
    Paragraph.aggregate([
      {
        $project: {
          quotesCount: { $size: "$genre.quotes" },
        },
      },
    ])
      .then((result) => {
        const { quotesCount } = result[0];
        const randomValue = Math.floor(Math.random() * quotesCount);

        return Paragraph.aggregate([
          { $unwind: "$genre.quotes" },
          { $skip: randomValue },
          { $limit: 1 },
        ]);
      })
      .then((quotes) => {
        const quote = quotes[0].genre.quotes;
        resolve(quote);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function disconnectUser(socketId) {
  Lobby.find({
    $or: [{ state: "waiting" }, { state: "in-progress" }],
  })
    .then((lobbies) => {
      console.log("in diconnectin", lobbies);
      return Promise.all(
        lobbies.map(async (lobby) => {
          const idx = lobby.players.findIndex(
            (player) => player.socketId === socketId
          );

          if (idx !== -1) {
            lobby.players.splice(idx, 1);
            await lobby.save();
          }

          if (lobby.players.length === 0) {
            Lobby.findByIdAndDelete(lobby._id);
            console.log("Lobbies after disconneting:", lobbies);
          }
        })
      );
    })
    .then(() => {
      console.log("All lobbies updated");
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = {
  createLobby,
  joinLobby,
  fetchQuote,
  getLobby,
  updateLobby,
  disconnectUser,
  switchLobbyState,
};
