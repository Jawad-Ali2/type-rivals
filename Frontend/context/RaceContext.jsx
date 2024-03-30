import { createContext, useState } from "react";

const RaceContext = createContext();

const RaceProvider = ({ children }) => {
  const [signalInterval, setSignalInterval] = useState(null);
  const [signal, setSignal] = useState(false);

  const initiateSignal = () => {
    setSignalInterval(
      setInterval(() => {
        setSignal((prev) => !prev);
        console.log("initSignal");
      }, 3000)
    );
  };

  const stopSignal = () => {
    console.log("stopSignal");
    clearInterval(signalInterval);
  };

  return (
    <RaceContext.Provider
      value={{
        signal,
        initiateSignal,
        stopSignal,
      }}
    >
      {children}
    </RaceContext.Provider>
  );
};

export { RaceContext, RaceProvider };
