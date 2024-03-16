import  RaceMap  from "@/components/RaceMap";
import  RaceLoader from "@/components/RaceLoader";
import { useCountDown, useFetch } from "../../Hooks";
import { useContext, useEffect, useRef, useState } from "react";

import createConnection from "../../utils/socket";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

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
  // const [paragraph, setParagraph] = useState("");
  const { userId, token } = useContext(AuthContext);
  const [startRace, setStartRace] = useState(false);
  // const [currentSession, setCurrentSession] = useState(null);
  const currentSessionRef = useRef(null);
  const [paragraph, audioLink, errors, resetData] = useFetch(
    "http://localhost:8000/user/quick-race"
  );

  //Reload/Update Components
  useEffect(() => {
    if (paragraph != "") resetData();
    currentSessionRef.current = null;
    resetPrepareTimer();
  }, [replay]);

  //Prepare Timer
  useEffect(() => {
    //* When the paragraph first arrives
    if (paragraph) {
      const socket = createConnection(token);
      //* Send signal to join the race
      socket.emit("joinRace", { userId: userId }, (joinedPlayers) => {
        // console.log("kjdg");
        // TODO: wait till paragraph arives
      });

      // * When 4 players has joined they all join a session
      socket.on("session", (sessionName) => {
        currentSessionRef.current = sessionName;
        console.log("Joining session", sessionName);
        socket.emit("joinSession", sessionName);
      });

      if (paragraph) setPrepareTimerOn(true);

      return () => {
        // * Once the user leaves the page (Reset and leave the session)
        socket.emit("leaveSession", currentSessionRef.current);
        currentSessionRef.current = null;
        socket.disconnect();
      };
    }
  }, [paragraph]);

  return (
    <section className="race-section w-full max-w-[45rem]">
      <RaceLoader loading={!paragraph} errors={null} time={prepareTime}>
        Fetching Paragraph...
      </RaceLoader>
      <div className="race-container pt-[5rem] w-[90%] mx-auto">
        <div className="racemap-container w-full">
          <p className="web-text font-semibold">Race Map</p>
          <RaceMap
            paragraph={paragraph}
            startRace={prepareTime <= 0}
            raceDuration={60}
            setReplay={setReplay}
          />
        </div>
      </div>
    </section>
  );
};


export default Race;