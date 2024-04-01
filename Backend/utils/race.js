const Paragraph = require("../models/paragraphs");
const User = require("../models/user");
const Lobby = require("../models/lobby");

function getLobby(lobbyId) {
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

async function updateLobby(
  lobbyId,
  socketId,
  wpm,
  percentage,
  raceTime,
  raceDuration
) {
  try {
    let raceHasFinished = true;
    const lobby = await getLobby(lobbyId);

    const player = lobby.players.find((player) => player.socketId === socketId);
    player.wpm = wpm;
    player.percentageCompleted = percentage;

    lobby.players.forEach((player) => {
      if (player.percentageCompleted !== 100) {
        raceHasFinished = false;
      }
    });
    // console.log("AGD", raceTime, raceDuration, socketId);

    if (raceHasFinished) {
      console.log(raceHasFinished, "kgjadlgkjsalk");
      lobby.state = "finished";
    } else if (raceDuration - raceTime === raceDuration) {
      console.log(raceTime, raceDuration, socketId);
      lobby.state = "finished";
    }

    await lobby.save();

    return Promise.resolve(raceHasFinished);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
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

    const playerAlreadyJoined = lobby.players.find(
      (player) => player.playerId === playerId
    );

    if (playerAlreadyJoined) return;

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
          userLeft: false,
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
  Lobby.find({ state: "waiting" })
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

          // TODO: ADD THIS FUNCTIONALITY
          // if there are no players in the lobby (and lobby is in-progress)
          if (lobby.players.length === 0 && lobby.state === "in-progress") {
            // Lobby.findByIdAndDelete(lobby._id);
            lobby.state = "waiting";
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
