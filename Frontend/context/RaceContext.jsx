import { createContext, useState } from "react";

const RaceContext = createContext();

const RaceProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [signalInterval, setSignalInterval] = useState(null);
  const [signal, setSignal] = useState(false);
  const [iHaveFinished, setIHaveFinished] = useState(false);
  const [raceHasFinished, setRaceHasFinished] = useState(false);
  const [userFinishTimer, setUserFinishTimer] = useState(60);

  const resetContext = () => {
    console.log("resetContext");
    setPlayers(() => []);
    setSignalInterval(null);
    setSignal(false);
    setIHaveFinished(false);
    setRaceHasFinished(false);
    setUserFinishTimer(60);
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

  const changeUserFinishTimer = (val) => {
    setUserFinishTimer(() => val);
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
      }}
    >
      {children}
    </RaceContext.Provider>
  );
};

export { RaceContext, RaceProvider };
