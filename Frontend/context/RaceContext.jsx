import React, { createContext, useContext, useRef, useState } from "react";
import createConnection from "../utils/socket";
import { AuthContext } from "../context/AuthContext";

const RaceContext = createContext();

const RaceProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const socket = React.useMemo(() => createConnection(token), [token]);
  const [players, setPlayers] = useState([]);
  const [signalInterval, setSignalInterval] = useState(null);
  const [signal, setSignal] = useState(false);
  const [iHaveFinished, setIHaveFinished] = useState(false);
  const [raceHasFinished, setRaceHasFinished] = useState(false);
  const [userFinishTimer, setUserFinishTimer] = useState(60);
  const [isFriendlyLobbyCreator, setIsFriendlyLobbyCreator] = useState(false);
  const isFriendlyMatchRef = useRef(false);
  const [friendlyLobbyCode, setFriendlyLobbyCode] = useState("");
  const [startRace, setStartRace] = useState(false);
  // const lobbySizeRef = useRef(null);

  const resetContext = () => {
    setPlayers(() => []);
    setSignalInterval(null);
    setSignal(false);
    setIHaveFinished(false);
    setRaceHasFinished(false);
    setUserFinishTimer(60);
    setIsFriendlyLobbyCreator(false);
    setStartRace(false);
  };

  const resetLobbySize = () => {
    // lobbySizeRef.current = null;
    isFriendlyMatchRef.current = false;
    setFriendlyLobbyCode("");
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
    clearInterval(signalInterval);
  };

  const changeIHaveFinished = (val) => {
    setIHaveFinished(() => val);
  };

  const changeUserFinishTimer = (val) => {
    setUserFinishTimer(() => val);
  };

  const getStartRace = () => startRace;

  const updateLobbySize = (lobbySize) => {
    // lobbySizeRef.current = lobbySize;
    // console.log("Lobby size update", lobbySizeRef.current);
  };

  return (
    <RaceContext.Provider
      value={{
        socket,
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
        // lobbySizeRef,
        updateLobbySize,
        resetLobbySize,
        isFriendlyMatchRef,
        isFriendlyLobbyCreator,
        setIsFriendlyLobbyCreator,
        friendlyLobbyCode,
        setFriendlyLobbyCode,
        startRace,
        setStartRace,
        getStartRace,
      }}
    >
      {children}
    </RaceContext.Provider>
  );
};

export { RaceContext, RaceProvider };
