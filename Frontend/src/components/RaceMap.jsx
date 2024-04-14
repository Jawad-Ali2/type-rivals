import "@/styles/RaceMap.css";
import { useRef, useState, useEffect, useContext } from "react";
import TrackInput from "@/components/TrackInput";
import RaceStats from "@/components/RaceStats";
import { useCountDown } from "../../Hooks";
import { calculateWPM } from "../../utils/calculateWPM";
import { AuthContext } from "../../context/AuthContext";
import createConnection from "../../utils/socket";
import { RaceContext } from "../../context/RaceContext";

const RaceMap = ({ paragraph, startRace, lobby, raceDuration, setReplay }) => {
  const success = "text-green-500";
  const error = "text-red-500";
  const { token } = useContext(AuthContext);
  const socket = createConnection(token);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(false);
  const paragraphRef = useRef();
  const [
    raceTime,
    raceTimerOn,
    resetRaceTimer,
    setRaceTimerOn,
    getRaceFormattedTime,
  ] = useCountDown(raceDuration);
  const [mask, setMask] = useState("");
  const [color, setColor] = useState(success);
  const {
    resetContext,
    signal,
    initiateSignal,
    stopSignal,
    iHaveFinished,
    setIhaveFinished,
    raceHasFinished,
    setRaceHasFinished,
    changeUserFinishTimer,
  } = useContext(RaceContext);

  //Focuses on Input on Race Start
  useEffect(() => {
    if (raceTimerOn) {
      const inp = document.querySelector(".track-input");
      inp.focus();
    }
  }, [raceTimerOn]);

  //Resets Hooks on Replay
  useEffect(() => {
    if (!paragraph) {
      setRaceHasFinished(() => false);
      setInput((prev) => "");
      setMask((prev) => "");
      resetRaceTimer();
      resetContext();
    }
  }, [paragraph]);

  useEffect(() => {
    if (startRace) {
      setRaceTimerOn((prev) => true);
      socket.on("raceFinished", (raceFinished1) => {
        console.log(raceFinished1);
        setRaceHasFinished(() => raceFinished1);
        stopSignal();
        setRaceTimerOn(() => false);
      });
    }
  }, [startRace]);

  //Race Progress & Comparison with mask
  useEffect(() => {
    if (correct) setMask((prev) => input);
  }, [input, correct]);

  useEffect(() => {
    if (correct) setColor((prev) => success);
    else setColor((prev) => error);
  }, [correct]);

  useEffect(() => {
    if (iHaveFinished) {
      setRaceTimerOn((prev) => false);
      changeUserFinishTimer(raceTime);
    }
  }, [iHaveFinished]);

  // If the time runs out
  useEffect(() => {
    if (raceTime <= 0 && !raceTimerOn) {
      // setRaceFinished((prev) => true);
      console.log("in here");
      setRaceHasFinished(() => true);
      stopSignal();
    }
  }, [signal, raceTimerOn]);
  // Getting speed after short intervals
  useEffect(() => {
    // First we check if totalTime - currentTime is not 0 (to handle NAN case)
    if (startRace && raceDuration - raceTime !== 0) {
      const [wpm, percentage] = calculateWPM(
        input,
        raceDuration - raceTime,
        paragraph,
        raceDuration
      );

      if (raceTimerOn) {
        if (!iHaveFinished) {
          socket.emit(
            "typingSpeedUpdate",
            wpm,
            percentage,
            lobby,
            socket.id,
            raceTime,
            raceDuration
          );
        }
      }
      if (iHaveFinished || raceTime === 0 || raceHasFinished) {
        // Sending one extra emit to get the right percentage when the race ends.
        socket.emit(
          "typingSpeedUpdate",
          wpm,
          percentage,
          lobby,
          socket.id,
          raceTime,
          raceDuration
        );
      }
    }
  }, [iHaveFinished, startRace, signal, raceHasFinished]);

  useEffect(() => {
    if (raceHasFinished) {
      stopSignal();
    }
  }, [raceHasFinished]);
  const unselectable = {
    resize: "none",
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    KhtmlUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
  };
  if (paragraphRef.current) {
    Object.assign(paragraphRef.current.style, unselectable);
    paragraphRef.current.disabled = true;
  }
  return (
    <section className="racemap-section relative">
      <RaceStats
        input={input}
        paragraph={paragraph}
        time={raceDuration - raceTime}
        setReplay={setReplay}
      />
      <p className="absolute font-semibold web-text right-0 top-[-1.4rem]">
        {getRaceFormattedTime(raceTime)}
      </p>
      <div className="racemap w-full h-fit rounded bg-primary-b border-2 border-primary-c text-left  p-2 overflow-hidden">
        <p
          ref={paragraphRef}
          className="w-full h-full bg-primary-b outline-none"
        >
          {paragraph}
        </p>
      </div>
      <div
        className={
          "racemask absolute top-[0rem] w-full  rounded  text-left border-t-2 border-l-2 border-primary-c p-2 overflow-hidden " +
          color
        }
      >
        <p className="w-full text-left h-full">{mask}</p>
      </div>
      <div className="input-area w-full mt-5">
        <TrackInput
          input={input}
          setInput={setInput}
          raceFinished={raceHasFinished}
          paragraph={paragraph}
          setCorrect={setCorrect}
          setRaceFinished={setRaceHasFinished}
        />
      </div>
    </section>
  );
};
export default RaceMap;
