import AudioMap from "@/components/AudioMap";
import RaceLoader from "@/components/RaceLoader";
import { useFetch, useCountDown } from "../../Hooks";
import { useEffect, useState } from "react";
import { backendUrl } from "../../config/config";
const Narrator = () => {
  document.title = "Narrator | Type Rivals";
  const [
    prepareTime,
    prepareTimerOn,
    resetPrepareTimer,
    setPrepareTimerOn,
    getPrepareFormattedTime,
  ] = useCountDown(5);
  const [paragraph, audioLink, errors, resetData] = useFetch(
    `${backendUrl}/user/quick-race/`
  );
  const [trackDuration, setTrackDuration] = useState(null);
  const [replay, setReplay] = useState(false);

  //Reload/Update Components
  useEffect(() => {
    resetPrepareTimer();
    resetData();
  }, [replay]);
  //Meta Data Handlings
  useEffect(() => {
    const audio = new Audio(audioLink);
    const handleMetaData = () => {
      setTrackDuration((prev) => audio.duration);
    };
    if (audioLink) {
      audio.addEventListener("loadedmetadata", handleMetaData);
      setPrepareTimerOn((prev) => true);
    }
    return () => {
      if (audioLink && audio)
        audio.removeEventListener("loadedmetadata", handleMetaData);
    };
  }, [audioLink]);
  return (
    <section className="narrator-section w-full max-w-[45rem]">
      <RaceLoader loading={!audioLink} time={prepareTime} errors={errors}>
        Fetching Audio...
      </RaceLoader>
      <div className="narrator-container w-full pt-[5rem]">
        {trackDuration && (
          <AudioMap
            paragraph={paragraph}
            audioLink={audioLink}
            startRace={prepareTime <= 0}
            trackDuration={trackDuration}
            setReplay={setReplay}
          />
        )}
      </div>
    </section>
  );
};
export default Narrator;
