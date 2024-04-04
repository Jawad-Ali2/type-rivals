import { createContext, useRef, useState } from "react";

const RaceContext = createContext();

const RaceProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [signalInterval, setSignalInterval] = useState(null);
  const [signal, setSignal] = useState(false);
  const [iHaveFinished, setIHaveFinished] = useState(false);
  const [raceHasFinished, setRaceHasFinished] = useState(false);
  const [userFinishTimer, setUserFinishTimer] = useState(60);
  // const [lobbySize, setLobbySize] = useState(null);
  const lobbySizeRef = useRef(null);

  const resetContext = () => {
    setPlayers(() => []);
    setSignalInterval(null);
    setSignal(false);
    setIHaveFinished(false);
    setRaceHasFinished(false);
    setUserFinishTimer(60);
    console.log("RESETING");
    lobbySizeRef.current = null;
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
        setSignal((prev) => !prev);
      }, 2000)
    );
  };

  const stopSignal = () => {
    console.log("stopSignal");
    clearInterval(signalInterval);
  };

  const changeIHaveFinished = (val) => {
    setIHaveFinished(() => val);
  };
  console.log("Update", lobbySizeRef);
  const changeUserFinishTimer = (val) => {
    setUserFinishTimer(() => val);
  };

  const updateLobbySize = (lobbySize) => {
    console.log(lobbySize);
    lobbySizeRef.current = lobbySize;
    console.log(lobbySizeRef.current);
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
        // lobbySize,
        // setLobbySize,
        lobbySizeRef,
        updateLobbySize,
      }}
    >
      {children}
    </RaceContext.Provider>
  );
};

export { RaceContext, RaceProvider };
