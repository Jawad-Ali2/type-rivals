import RaceMap from "@/components/RaceMap";
import RaceLoader from "@/components/RaceLoader";
import { useCountDown, useFetch } from "../../Hooks";
import { useContext, useEffect, useRef, useState } from "react";

import createConnection from "../../utils/socket";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { RaceUser } from "@/components/RaceUser";
import { RaceContext } from "../../context/RaceContext";

const Race = () => {
  document.title = "Race | Type Rivals";
  const [
    prepareTime,
    prepareTimerOn,
    resetPrepareTimer,
    setPrepareTimerOn,
    getPrepareFormattedTime,
  ] = useCountDown(5);
  const [replay, setReplay] = useState(false);
  const [paragraph, setParagraph] = useState("");
  const [players, setPlayers] = useState([]);
  const [playersConnected, setPlayersConnected] = useState(false);
  const { userId, token } = useContext(AuthContext);
  const [socketConnected, setSocketConnected] = useState(false);
  const socket = createConnection(token);
  const currentLobbyRef = useRef(null);
  const { resetContext, signal, initiateSignal, stopSignal, iHaveFinished } =
    useContext(RaceContext);

  //Reload/Update Components
  useEffect(() => {
    if (paragraph) {
      setParagraph("");
      setPlayers(() => []);
      setPlayersConnected(() => false);
      resetPrepareTimer();
      resetContext();
      stopSignal();
    }
  }, [replay]);

  console.log(lobbySizeRef);
  //Prepare Timer
  useEffect(() => {
    if (paragraph.length === 0) {
      // * If noOfPlayers prop is defined that means its not a friendly match
      if (noOfPlayers) {
        lobbySizeRef.current = noOfPlayers;
      }
      // Send signal to join the race
      socket.emit("createOrJoinLobby", userId);
      socket.on("message", (quote, lobby) => {
        currentLobbyRef.current = lobby._id;
        setPlayers([...lobby.players]);
        setParagraph(quote.text);
        setSocketConnected(true);

        setPlayersConnected(() => true);
        initiateSignal();
      });

      // Return a cleanup function to prevent the effect from running again
      return () => {
        // Case1 : When the user is in waiting state and leave
        if (paragraph.length === 0 && !currentLobbyRef.current) {
          console.log("UNMOUNTING");

          socket.emit("leaveRace");
        }
      };
    }
    if (paragraph) {
      setPrepareTimerOn(true);
    }
    return () => {
      // Case 2: When the user is competing with players but leave before the race ends
      if (socketConnected) {
        socket.emit("leaveRace");
        stopSignal();
        // If the socket is still connected when the component unmounts,
        console.log("Unmounting");
        currentLobbyRef.current = null;
        socket.off();

        // Set the flag back to false to indicate the socket is disconnected
        setSocketConnected(false);
      }
    };
  }, [paragraph]);

  // Each player sees himself on top of the list always
  useEffect(() => {
    const updatedPlayers = [...players];

    updatedPlayers.forEach((player, index) => {
      if (player.playerId === userId && index > 0) {
        const temp = updatedPlayers[0];
        updatedPlayers[0] = player;
        updatedPlayers[index] = temp;
      }
    });

    setPlayers(updatedPlayers);
  }, [playersConnected]);

  return (
    <section className="race-section w-full max-w-[45rem]">
      <RaceLoader loading={!paragraph} errors={null} time={prepareTime}>
        Fetching Paragraph...
      </RaceLoader>
      <div className="race-container pt-[5rem] w-[90%] mx-auto">
        <div className="racemap-container w-full">
          <RaceUser players={players} setPlayers={setPlayers} token={token} />

          <p className="web-text font-semibold">Race Map</p>
          <RaceMap
            paragraph={paragraph}
            startRace={prepareTime <= 0}
            lobby={currentLobbyRef.current}
            raceDuration={60}
            setReplay={setReplay}
          />
          <button
            className={`web-text web-button ${!iHaveFinished && "hidden"}`}
            onClick={() => setReplay((prev) => !prev)}
          >
            Play Again
          </button>
        </div>
      </div>
    </section>
  );
};

export default Race;
