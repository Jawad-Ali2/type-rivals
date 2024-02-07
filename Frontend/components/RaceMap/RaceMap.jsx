import "./RaceMap.css";
import { useState, useEffect, useContext } from "react";
export const RaceMap = ({
  maskRef,
  originalRef,
  setRaceFinished,
  setMistakes,
  raceData,
  raceTimerOn,
}) => {
  const success = "text-green-600";
  const error = "text-red-500";
  const [input, setInput] = useState("");
  const [mask, setMask] = useState("");
  const [color, setColor] = useState(success);
  const [raceTrack, setRaceTrack] = useState(raceData);
  
  //Focuses on Input on Race Start
  useEffect(() => {
    if (raceTimerOn) {
      const inp = document.querySelector(".track-input");
      inp.focus();
    }
  }, [raceTimerOn]);

  //Sets Paragraph when Paragraph is Fetched
  useEffect(()=>{
    if(!raceData){
      setMask(prev=>"")
      setRaceTrack(prev=>"")
      setInput(prev=>"")
      setColor(prev=>success)
    }else{
    setRaceTrack(prev=>raceData)
    }
    
  }, [raceData])

  //Race Progress & Comparison with mask
  useEffect(() => {
      if (input === raceTrack && raceTrack) {
        setRaceFinished((prev) => true);
      }
      const progressed_race = raceTrack.slice(0, input.length);
      if (input === progressed_race) {
        setMask((prev) => input);
        setColor(success);
      } else {
        setMistakes((prev) => prev + 1);
        setColor(error);
      }
  
  }, [input, raceTrack]);

  return (
    <section className="racemap-section relative">
      <div
        ref={originalRef}
        className="racemap w-full h-fit rounded web-foreground text-left web-text p-2 overflow-hidden"
      >
        {raceTrack}
      </div>
      <div
        ref={maskRef}
        className={
          "racemask absolute top-[1.5rem] w-full h-fit rounded  text-left  p-2 overflow-hidden " +
          color
        }
      >
        {mask}
      </div>
      <div className="input-area w-full mt-5">
        <input
          disabled={!raceTimerOn}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
          className="track-input w-full web-text web-body outline-none px-2 h-[2rem] border-b-2 border-[#1C2936]"
          placeholder="Type Here..."
        ></input>
      </div>
    </section>
  );
};
