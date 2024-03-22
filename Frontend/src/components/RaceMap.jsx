import "@/styles/RaceMap.css";
import { useState, useEffect, useContext } from "react";
import TrackInput from "@/components/TrackInput";
import RaceStats from "@/components/RaceStats";
import { useCountDown } from "../../Hooks";
import { calculateWPM } from "../../utils/calculateWPM";
import { AuthContext } from "../../context/AuthContext";
import createConnection from "../../utils/socket";
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
  const [intervalDuration, setIntervalDuration] = useState(2000);

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
      setRaceFinished((prev) => false);
      setInput((prev) => "");
      setMask((prev) => "");
      resetRaceTimer();
    }
  }, [paragraph]);

  useEffect(() => {
    if (startRace) {
      setRaceTimerOn((prev) => true);
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
    }
  }, [raceTime, raceTimerOn]);

  // Getting speed after short intervals
  useEffect(() => {
    if (raceTime > 0 && startRace) {
      let wpmInterval;
      const [wpm, percentage] = calculateWPM(
        input,
        raceDuration - raceTime,
        paragraph,
        raceDuration
      );
      if (!raceFinished) {
        const calculateWPMInterval = () => {
          // console.log(percentage);

          // TODO: Emit signal to backend after every 2 sec with wpm calculation
          console.log("WPM calculation" + wpm, percentage);
          socket.emit("typingSpeedUpdate", wpm, percentage, lobby, socket.id);

          const newInterval = Math.max(2000 / wpm, 200);
          setIntervalDuration(newInterval);
        };

        calculateWPMInterval();

        wpmInterval = setInterval(calculateWPMInterval, 2000);
      } else {
        // Sending one extra emit to get the right percentage when the race ends.
        socket.emit("typingSpeedUpdate", wpm, percentage, lobby, socket.id);
        clearInterval(wpmInterval);
      }

      return () => {
        clearInterval(wpmInterval);
      };
    }
  }, [raceTime, raceFinished]);

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
