const Paragraph = require("../models/paragraphs");
const User = require("../models/user");
const Lobby = require("../models/lobby");
const { generateLobbyCode } = require("./generateLobbyCode");

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

    // ! Both the written and given paragraph must be same also to finish race!!!!
    if (raceHasFinished || raceDuration - raceTime === raceDuration) {
      player.completionTime = raceTime;
      lobby.state = "finished";
    }

    await lobby.save();

    return Promise.resolve(raceHasFinished);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

function createFriendlyLobby(noOfPlayers) {
  return new Promise((resolve, reject) => {
    const lobbyID = generateLobbyCode();
    let lobby;

    lobby = new Lobby({
      players: [],
      state: "waiting", // three states ('waiting', 'in_progress', 'finished')
      lobbyType: "Friendly",
      lobbySize: noOfPlayers,
      lobbyCode: lobbyID,
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

function createMultiplayerLobby(noOfPlayers) {
  // console.log(noOfPlayers);
  return new Promise((resolve, reject) => {
    const lobby = new Lobby({
      players: [],
      state: "waiting", // three states ('waiting', 'in_progress', 'finished')
      lobbyType: "Multiplayer",
      lobbySize: noOfPlayers,
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

/**
 * Joins a lobby
 * @param {string} playerId - The player ID
 * @param {Socket} socket - The socket object
 * @param {int} noOfPlayers - The number of players
 * @param {boolean} isFriendlyMatch - Whether the match is a friendly match or not
 * @param {boolean} isFriendlyLobbyCreator - Whether the player is the creator of the lobby
 * @param {string} friendLobbyID - The ID of the friend's lobby, if it's a friendly match
 * @returns {Promise<Lobby>} The updated lobby
 */
function joinLobby(
  playerId,
  socket,
  noOfPlayers,
  isFriendlyMatch,
  isFriendlyLobbyCreator,
  friendLobbyID
) {
  return new Promise(async (resolve, reject) => {
    let lobby;
    // console.log(isFriendlyLobbyCreator, isFriendlyMatch);

    // * Case 1: When the player is the creator of lobby
    if (isFriendlyMatch && isFriendlyLobbyCreator) {
      lobby = await createFriendlyLobby(noOfPlayers);
    } else if (isFriendlyMatch && friendLobbyID) {
      // * Case 2: When the player wants to join someone else's lobby
      lobby = await Lobby.findOne({
        $and: [
          { lobbyCode: friendLobbyID },
          { state: "waiting" },
          { lobbyType: "Friendly" },
        ],
      });

      // console.log(lobby);

      if (!lobby) throw new Error("Lobby ID is invalid");
    } else {
      // * When the user is just looking for a match
      lobby = await Lobby.findOne({
        $and: [{ state: "waiting" }, { lobbyType: "Multiplayer" }],
      });
      // console.log("In else statement", lobby);
      if (!lobby) lobby = await createMultiplayerLobby(noOfPlayers);
    }

    // * At this point we have a lobby of specific type

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
          completionTime: 0,
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

async function disconnectUser(socketId) {
  try {
    const lobbies = await Lobby.find({
      $or: [{ state: "waiting" }, { state: "in-progress" }],
    });
    // console.log("in diconnectin", lobbies);

    for (const lobby of lobbies) {
      const idx = lobby.players.findIndex(
        (player) => player.socketId === socketId
      );

      if (idx !== -1) {
        // lobby.players.splice(idx, 1);
        // if there are no players in the lobby (and lobby is in-progress)
        await Lobby.findOneAndUpdate(
          { _id: lobby._id },
          { $pull: { players: { socketId: socketId } } }
        );

        if (lobby.players.length === 0) {
          // If the lobby was in-progress, delete it
          await Lobby.findByIdAndDelete(lobby._id);
        }
        // await lobby.save();
      }

      // TODO: ADD THIS FUNCTIONALITY
    }
    console.log("All lobbies updated");
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  createMultiplayerLobby,
  joinLobby,
  fetchQuote,
  getLobby,
  updateLobby,
  disconnectUser,
  switchLobbyState,
};
