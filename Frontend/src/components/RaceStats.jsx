import { useContext, useEffect, useRef, useState } from "react";
import { saveUserData } from "../../utils";
import { AuthContext } from "../../context/AuthContext";
import { calculateWPM } from "../../utils/calculateWPM";
import { RaceContext } from "../../context/RaceContext";
import { MdOutlineReplayCircleFilled } from "react-icons/md";

const RaceStats = ({ input, paragraph, time, setReplay }) => {
  const [speed, setSpeed] = useState(0);
  const timeTakenRef = useRef(null);
  const { token, csrfToken, userId } = useContext(AuthContext);
  const {
    userFinishTimer,
    raceHasFinished,
    isFriendlyMatchRef,
    iHaveFinished,
  } = useContext(RaceContext);

  // console.log(raceHasFinished);
  useEffect(() => {
    if (iHaveFinished || raceHasFinished) {
      const [wpm] = calculateWPM(input, time, paragraph, 60);
      setSpeed((prev) => wpm);
      
      if (userFinishTimer === 60) {
        timeTakenRef.current = "1:00";
      } else {
        const date = new Date((60 - userFinishTimer) * 1000);
        const timeString = date.toISOString().slice(14, 19);
        timeTakenRef.current = timeString;
      }

      if (!isFriendlyMatchRef.current && iHaveFinished) {
        saveUserData(speed, userId, token, csrfToken);
      }
    }
  }, [iHaveFinished, userFinishTimer, raceHasFinished]);

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
            <tr className="w-[12rem] h-10 border-2 border-primary-f rounded-full ">
              <td className="float-left bg-primary-e rounded-full w-24 text-center inline h-full py-2 text-sm">
                Speed
              </td>
              <td className="float-right inline text-sm px-2 py-2">
                {speed} WPM
              </td>
            </tr>
            <tr className="w-[12rem] h-10 border-2 border-primary-f rounded-full">
              <td className="float-left bg-primary-e rounded-full w-24 text-center inline h-full py-2 text-sm">
                Accuracy
              </td>
              <td className="float-right inline text-sm px-2 py-2">100%</td>
            </tr>
            <tr className="w-[12rem] h-10 border-2 border-primary-f rounded-full">
              <td className="float-left bg-primary-e rounded-full w-24 text-center inline h-full py-2 text-sm">
                Time
              </td>
              <td className="float-right inline text-sm px-2 py-2">
                {timeTakenRef.current}
              </td>
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

        <button
          className={`bg-primary-e ui-button space-x-2 mt-5 ${
            !iHaveFinished && "hidden"
          }`}
          onClick={() => setReplay((prev) => !prev)}
        >
          <p className="inline">Play Again</p>
          <MdOutlineReplayCircleFilled
            className="bg-primary-e inline"
            size={20}
          />
        </button>
      </div>
    </div>
  );
};
export default RaceStats;
