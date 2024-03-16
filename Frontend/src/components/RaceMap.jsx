import "./RaceMap.css";
import { useState, useEffect, useContext } from "react";
import { TrackInput } from "../TrackInput/TrackInput";
import { RaceStats } from "../RaceStats/RaceStats";
import { useCountDown } from "../../Hooks";
const RaceMap = ({ paragraph, startRace, raceDuration,setReplay }) => {
  const success = "text-green-600";
  const error = "text-red-500";
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

  //Focuses on Input on Race Start
  useEffect(() => {

    if (raceTimerOn) {
      const inp = document.querySelector(".track-input");
      inp.focus();
    }
  }, [raceTimerOn]);

  //Resets Hooks on Replay
  useEffect(()=>{
    if(!paragraph){
      setRaceFinished(prev=>false)
      setInput(prev=>"")
      setMask(prev=>"")
      resetRaceTimer()
    }
  }, [paragraph])
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
  useEffect(() => {
    if (raceTime <= 0 && !raceTimerOn) {
      setRaceFinished((prev) => true);
    }
  }, [raceTime, raceTimerOn]);

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