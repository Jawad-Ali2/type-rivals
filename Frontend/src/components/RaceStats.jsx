import { useContext, useEffect, useState } from "react";
import { saveUserData } from "../../utils";
import { AuthContext } from "../../context/AuthContext";
import { calculateWPM } from "../../utils/calculateWPM";
const RaceStats = ({ input, paragraph, time, raceFinisihed, setReplay }) => {
  const [speed, setSpeed] = useState(0);
  const { token, csrfToken, userId } = useContext(AuthContext);

  useEffect(() => {
    if (raceFinisihed) {
      const [wpm] = calculateWPM(input, time, paragraph);
      setSpeed((prev) => wpm);
      saveUserData(speed, userId, token, csrfToken);
    }
  }, [raceFinisihed]);

  return (
    <div
      className={
        "lock-screen transition-all duration-300 fixed w-full flex flex-col items-center justify-center left-0 top-[5rem]   h-full bg-skin-opaque " +
        (raceFinisihed ? "bg-opacity-40 z-[40]" : "bg-opacity-0 z-[-10]")
      }
    >
      <div
        className={
          "stats-container  rounded-sm text-skin-base transition-all shadow-md shadow-skin-base bg-skin-overlayBG  duration-300 fixed  flex flex-col items-center justify-between p-2 w-[20rem]  h-[20rem] " +
          (raceFinisihed ? "top-[13rem]" : "top-[-25rem]")
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
            <tr className="faded-border border-b-2 w-[10rem]">
              <td className="float-left">Speed</td>
              <td className="float-right">{speed} WPM</td>
            </tr>
            <tr className="faded-border border-b-2 w-[10rem]">
              <td className="float-left">Accuracy</td>
              <td className="float-right">100%</td>
            </tr>
            <tr className="faded-border border-b-2 w-[10rem]">
              <td className="float-left">Time</td>
              <td className="float-right">01:00</td>
            </tr>
          </tbody>
        </table>
        <button
          onClick={() => {
            setReplay((prev) => !prev);
          }}
          className="text-skin-base shadow-md shadow-skin-base bg-skin-button  ui-button"
        >
          Replay
        </button>
      </div>
    </div>
  );
};
export default RaceStats;
