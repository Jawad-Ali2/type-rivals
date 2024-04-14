import { useContext, useEffect, useState } from "react";
import { saveUserData } from "../../utils";
import { AuthContext } from "../../context/AuthContext";
import { calculateWPM } from "../../utils/calculateWPM";
import { RaceContext } from "../../context/RaceContext";
const RaceStats = ({ input, paragraph, time, setReplay }) => {
  const [speed, setSpeed] = useState(0);
  const [timeTaken, setTimeTaken] = useState("");
  const { token, csrfToken, userId } = useContext(AuthContext);
  const {
    userFinishTimer,
    raceHasFinished,
    isFriendlyMatchRef,
    iHaveFinished,
  } = useContext(RaceContext);

  // console.log(raceHasFinished);
  useEffect(() => {
    if (iHaveFinished) {
      const [wpm] = calculateWPM(input, time, paragraph, 60);
      setSpeed((prev) => wpm);

      const minutes = Math.floor(userFinishTimer / 60);
      let remainingTime = userFinishTimer % 60;
      if (remainingTime === 0) remainingTime = "00";
      setTimeTaken(minutes + ":" + remainingTime);
      console.log("save data");
      if (!isFriendlyMatchRef.length && iHaveFinished) {
        saveUserData(speed, userId, token, csrfToken);
      }
    }
  }, [iHaveFinished]);

  return (
    <div
      className={
        "lock-screen transition-all duration-300 fixed w-full flex flex-col items-center justify-center left-0 top-[5rem]   h-full bg-slate-800 " +
        (raceHasFinished ? "bg-opacity-50 z-[60]" : "bg-opacity-0 z-[-10]")
      }
    >
      <div
        className={
          "stats-container  rounded-md border-2 border-primary-f  transition-all  bg-primary-c  duration-300 fixed  flex flex-col items-center justify-between p-2 w-[20rem]  h-[20rem] z-60 " +
          (raceHasFinished ? "top-[13rem]" : "top-[-25rem]")
        }
      >
        <p className=" text-xl  w-full text-center">Statistics</p>
        <table className="w-full h-full">
          <thead>
            <tr className="w-full">
              <th className="float-left"></th>
              <th className="float-right"></th>
            </tr>
          </thead>
          <tbody className="w-full h-full flex flex-col justify-around items-center">
            <tr className="w-[10rem]">
              <td className="float-left">Speed</td>
              <td className="float-right">{speed} WPM</td>
            </tr>
            <tr className="w-[10rem]">
              <td className="float-left">Accuracy</td>
              <td className="float-right">100%</td>
            </tr>
            <tr className="w-[10rem]">
              <td className="float-left">Time</td>
              <td className="float-right">{timeTaken}</td>
            </tr>
          </tbody>
        </table>
        <button
          onClick={() => {
            setReplay((prev) => !prev);
          }}
          className="bg-primary-e  ui-button"
        >
          Replay
        </button>
      </div>
    </div>
  );
};
export default RaceStats;
