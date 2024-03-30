import "@/styles/RaceMap.css";
import { useState, useEffect, useContext } from "react";
import TrackInput from "@/components/TrackInput";
import RaceStats from "@/components/RaceStats";
import { useCountDown } from "../../Hooks";
import { calculateWPM } from "../../utils/calculateWPM";
import { AuthContext } from "../../context/AuthContext";
import createConnection from "../../utils/socket";
import { RaceContext } from "../../context/RaceContext";
const RaceMap = ({ paragraph, startRace, lobby, raceDuration, setReplay }) => {
  const success = "text-green-600";
  const error = "text-red-500";
  const { token } = useContext(AuthContext);
  const socket = createConnection(token);
  const [input, setInput] = useState("");
  const [correct, setCorrect] = useState(false);
  const [
    raceTime,
    raceTimerOn,
    resetRaceTimer,
    setRaceTimerOn,
    getRaceFormattedTime,
  ] = useCountDown(raceDuration);
  const [mask, setMask] = useState("");
  const [color, setColor] = useState(success);
  const [raceFinished, setRaceFinished] = useState(false);
  const { signal, initiateSignal, stopSignal } = useContext(RaceContext);
  // const [sendSignal, setSendSignal] = useState(false);
  // const [signalInterval, setSignalInterval] = useState();

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
      console.log("RESET");
      setRaceFinished((prev) => false);
      setInput((prev) => "");
      setMask((prev) => "");
      resetRaceTimer();
    }
  }, [paragraph]);

  useEffect(() => {
    if (startRace) {
      setRaceTimerOn((prev) => true);
      console.log("RaceTimer");
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
    if (raceFinished) setRaceTimerOn((prev) => false);
  }, [raceFinished]);

  // If the time runs out
  useEffect(() => {
    if (raceTime <= 0 && !raceTimerOn) {
      setRaceFinished((prev) => true);
      // clearInterval(signalInterval);
      stopSignal();
    }
  }, [raceTime, raceTimerOn]);

  // Getting speed after short intervals
  useEffect(() => {
    if (raceTimerOn) {
      const [wpm, percentage] = calculateWPM(
        input,
        raceDuration - raceTime,
        paragraph,
        raceDuration
      );
      if (!raceFinished) {
        // wpmInterval = setInterval(calculateWPMInterval, 3000);
        console.log("INTERVALLL", raceTime);
        socket.emit(
          "typingSpeedUpdate",
          wpm,
          percentage,
          lobby,
          socket.id,
          raceTime,
          raceDuration
        );
      } else {
        // Sending one extra emit to get the right percentage when the race ends.
        socket.emit(
          "typingSpeedUpdate",
          wpm,
          percentage,
          lobby,
          socket.id,
          raceTime,
          raceDuration,
          "FINAL"
        );
        setRaceFinished(() => true);
        setRaceTimerOn(() => false);
      }
    }
  }, [raceFinished, startRace, signal]);

  // useEffect(() => {
  //   initiateSignal();

  //   return () => {
  //     // clearInterval(signalInterval);
  //     stopSignal();
  //   };
  // }, []);

  useEffect(() => {
    if (raceFinished) {
      // clearInterval(signalInterval);
      stopSignal();
    }
  }, [raceFinished]);

  return (
    <section className="racemap-section relative">
      <RaceStats
        input={input}
        paragraph={paragraph}
        time={raceDuration - raceTime}
        raceFinisihed={raceFinished}
        setReplay={setReplay}
      />
      <p className="absolute font-semibold web-text right-0 top-[-1.4rem]">
        {getRaceFormattedTime(raceTime)}
      </p>
      <div className="racemap w-full h-fit rounded bg-skin-foreground text-left web-text p-2 overflow-hidden">
        {paragraph}
      </div>
      <div
        className={
          "racemask absolute top-[0rem] w-full h-fit rounded  text-left  p-2 overflow-hidden " +
          color
        }
      >
        {mask}
      </div>
      <div className="input-area w-full mt-5">
        <TrackInput
          input={input}
          setInput={setInput}
          raceFinished={raceFinished}
          paragraph={paragraph}
          setCorrect={setCorrect}
          setRaceFinished={setRaceFinished}
        />
      </div>
    </section>
  );
};
export default RaceMap;
