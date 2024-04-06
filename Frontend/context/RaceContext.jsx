import { createContext, useRef, useState } from "react";

const RaceContext = createContext();

const RaceProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [signalInterval, setSignalInterval] = useState(null);
  const [signal, setSignal] = useState(false);
  const [iHaveFinished, setIHaveFinished] = useState(false);
  const [raceHasFinished, setRaceHasFinished] = useState(false);
  const [userFinishTimer, setUserFinishTimer] = useState(60);
  const [isFriendlyMatch, setIsFriendlyMatch] = useState(null);
  const lobbySizeRef = useRef(null);

  const resetContext = () => {
    setPlayers(() => []);
    setSignalInterval(null);
    setSignal(false);
    setIHaveFinished(false);
    setRaceHasFinished(false);
    setUserFinishTimer(60);
    console.log("RESETING");
  };

  const resetLobbySize = () => {
    lobbySizeRef.current = null;
    setIsFriendlyMatch(false);
  };

  const getPlayers = () => {
    return players;
  };

  // TODO: Maybe add players one by one (given that the backend adds this functionality)
  // Initially adds all the players
  const addPlayers = (players) => {
    // Array of players
    setPlayers(players);
  };

  const updatePlayers = () => {};

  const initiateSignal = () => {
    setSignalInterval(
      setInterval(() => {
        console.log("SENDING SIGNAL");
        setSignal((prev) => !prev);
      }, 2000)
    );
  };

  const stopSignal = () => {
    clearInterval(signalInterval);
  };

  const changeIHaveFinished = (val) => {
    setIHaveFinished(() => val);
  };

  const changeUserFinishTimer = (val) => {
    setUserFinishTimer(() => val);
  };

  const updateLobbySize = (lobbySize) => {
    lobbySizeRef.current = lobbySize;
    console.log("Lobby size update", lobbySizeRef.current);
  };

  return (
    <RaceContext.Provider
      value={{
        resetContext,
        players,
        signal,
        initiateSignal,
        stopSignal,
        iHaveFinished,
        changeIHaveFinished,
        raceHasFinished,
        setRaceHasFinished,
        userFinishTimer,
        changeUserFinishTimer,
        lobbySizeRef,
        updateLobbySize,
        isFriendlyMatch,
        setIsFriendlyMatch,
        resetLobbySize,
      }}
    >
      {children}
    </RaceContext.Provider>
  );
};

export { RaceContext, RaceProvider };
