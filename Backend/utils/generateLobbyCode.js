const cryto = require("crypto");

const generateLobbyCode = () => {
  const uuid = cryto.randomUUID();

  const sixLetters = uuid.slice(0, 6);

  return sixLetters.toUpperCase();
};

module.exports = { generateLobbyCode };
