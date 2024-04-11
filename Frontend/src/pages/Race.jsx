import RaceMap from "@/components/RaceMap";
import RaceLoader from "@/components/RaceLoader";
import { useCountDown, useFetch } from "../../Hooks";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
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
  // Getting params query
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const noOfPlayers = queryParams.get("lobbySize");
  const isFriendlyLobby = queryParams.get("friendlyMatch");

  // ! REFRESH ERROR IS BECAUSE WHEN REFRESH THE BACKEND HAS NOOFPLAYERS AS NULL
  const [replay, setReplay] = useState(false);
  const [paragraph, setParagraph] = useState("");
  const [players, setPlayers] = useState([]);
  const [playersConnected, setPlayersConnected] = useState(false);
  const { userId, token } = useContext(AuthContext);
  const [socketConnected, setSocketConnected] = useState(false);
  const currentLobbyRef = useRef(null);
  const {
    socket,
    resetContext,
    initiateSignal,
    stopSignal,
    iHaveFinished,
    resetLobbySize,
    isFriendlyMatchRef,
    isFriendlyLobbyCreator,
    friendlyLobbyCode,
    setFriendlyLobbyCode,
  } = useContext(RaceContext);

  //Reload/Update Components
  useEffect(() => {
    if (paragraph) setParagraph("");
    setPlayers(() => []);
    setPlayersConnected(() => false);
    resetPrepareTimer();
    resetContext();
    stopSignal();
  }, [replay]);

  // Specifically to detect and update the friendlyMatch state
  useEffect(() => {
    // * If noOfPlayers prop is defined that means its not a friendly match
    if (isFriendlyLobby) {
      isFriendlyMatchRef.current = true;
    }

    console.log(
      "no of players",
      friendlyLobbyCode,
      isFriendlyMatchRef.current,
      isFriendlyLobbyCreator
    );
  }, [isFriendlyLobby]);

  //Prepare Timer
  useEffect(() => {
    if (paragraph.length === 0) {
      // Send signal to join the race
      socket.emit(
        "createOrJoinLobby",
        userId,
        noOfPlayers,
        isFriendlyMatchRef.current,
        isFriendlyLobbyCreator,
        friendlyLobbyCode
      );
      socket.on("message", (quote, lobby) => {
        currentLobbyRef.current = lobby._id;
        setPlayers([...lobby.players]);
        setParagraph(quote.text);
        setSocketConnected(true);

        setPlayersConnected(() => true);
        initiateSignal();
      });

      // Current game is friendly we set the generated code
      socket.on("generatedLobbyCode", (lobbyCode) => {
        setFriendlyLobbyCode(lobbyCode);
      });

      // Return a cleanup function to prevent the effect from running again
      return () => {
        // Case1 : When the user is in waiting state and leave
        if (paragraph.length === 0 && !currentLobbyRef.current) {
          console.log("UNMOUNTING");
          resetLobbySize();
          resetContext();
          socket.emit("leaveRace", socket.id);
        }
      };
    }
    if (paragraph) {
      setPrepareTimerOn(true);
    }
    return () => {
      // Case 2: When the user is competing with players but leave before the race ends
      if (socketConnected) {
        // Only send this if user is typing and hasn't finished the race
        if (!iHaveFinished) socket.emit("leaveRace", socket.id);
        resetLobbySize();
        resetContext();
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
      <div>
        {
          // Display the lobby code only if it is a friendly match
          isFriendlyMatchRef.current && (
            <p className="web-text text-center mt-2">
              LOBBY CODE: {friendlyLobbyCode}
            </p>
          )
        }
      </div>
    </section>
  );
};

export default Race;
