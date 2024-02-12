import { RaceMap } from "../../components";
import { useCountDown, useFetch } from "../../Hooks";
import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RaceLoader } from "../../components";
import { saveUserData } from "../../utils";
import { AuthContext } from "../../context/AuthContext";

export const Race = () => {
  document.title = "Race | Type Rivals";
  const [
    prepareTime,
    prepareTimerOn,
    resetPrepareTimer,
    setPrepareTimerOn,
    getPrepareFormattedTime,
  ] = useCountDown(5);
  const [paragraph, audioLink, errors, resetData] = useFetch(
    "http://localhost:8000/user/quick-race/"
  );

  const [replay, setReplay] = useState(false);

  //Reload/Update Components
  const update = useEffect(() => {
    resetData()
    resetPrepareTimer()
  }, [replay]);
  //Prepare Timer
  useEffect(() => {
    if (paragraph) {
      setPrepareTimerOn(true);
    }
  }, [paragraph]);

  return (
    <section className="race-section w-full max-w-[45rem]">
      <RaceLoader loading={!paragraph} errors={errors} time={prepareTime}>
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
