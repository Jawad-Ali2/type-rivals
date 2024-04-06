const cryto = require("crypto");

const generateLobbyCode = () => {
  const uuid = cryto.randomUUID();

  return uuid;
  const sixLetters = uuid.slice(0, 6);

  // * This matches every sequence of 3 characters, except for the last. The ?! means, unless followed by ... and $ means the end of the string.
  return sixLetters.replace(/.{3}(?!$)/g, "$&-");
};

module.exports = { generateLobbyCode };
