import "./RaceMap.css";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const RaceMap = ({
  maskRef,
  originalRef,
  setRaceFinished,
  setMistakes,
  setRaceStarted,
  setErrors,
  raceTimerOn
}) => {
  const success = "text-green-600";
  const error = "text-red-500";
  const [input, setInput] = useState("");
  const [mask, setMask] = useState("");
  const [color, setColor] = useState(success);
  const [raceTrack, setRaceTrack] = useState("");
  const [raceDataFetch, setRaceDataFetch] = useState(false);
  const { isAuthenticated, token } = useContext(AuthContext);
  const navigate = useNavigate();

  //   const raceTrack =
  //     "Anime, a captivating form of animated entertainment originating from Japan, has grown into a global phenomenon. Its influence extends far beyond its home country, captivating audiences worldwide with its diverse genres and compelling storytelling.";

  useEffect(()=>{
    if(raceTimerOn){
      const inp = document.querySelector(".track-input")
      inp.focus()
    }
  }, [raceTimerOn])
  useEffect(() => {
    let isMounted = true;
    console.log("Is Auth: "+isAuthenticated);
    console.log("Token: "+ token)
    if (!isAuthenticated) {
      return navigate("/auth");
    }

  
    async function getParagraph() {
      try {
        console.log("Function called");
        const response = await fetch("http://localhost:8000/user/quick-race", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Context:", data);
          if (isMounted) {
            setRaceTrack(data.content.text);
            setRaceDataFetch(true);
            setRaceStarted(true)
          }
        }
      } catch (error) {
        console.error(error);
        setErrors(prev=>error)
      }
    }
    getParagraph();

    return () => {
      isMounted = false;
    };
  }, [token, isAuthenticated]);

  useEffect(() => {
    if (raceDataFetch) {
      console.log(raceTrack);
      // console.log("inside test");
      if (input === raceTrack) {
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
    }
  }, [input, raceTrack, raceDataFetch]);

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
        disabled={raceTimerOn? false: true}
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
