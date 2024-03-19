import { useState, useEffect } from "react";
export const useCountDown = (time_in_seconds) => {
  const [time, setTime] = useState(time_in_seconds);
  const [timerOn, setTimerOn] = useState(false);

  const resetTimer = () => {
    setTime((prev) => time_in_seconds);
    setTimerOn((prev) => false);
  };
  useEffect(() => {
    let timerID;
    if (time > 0 && timerOn) {
      timerID = setInterval(() => {
        setTime((prev_time) => prev_time - 1);
      }, 1000);
    }
    if (time <= 0) setTimerOn((prev) => false);
    return () => {
      clearInterval(timerID);
    };
  }, [time, timerOn]);
  const getFormmatedTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.round(time % 60);
    if (minutes < 0) minutes = 0;
    if (seconds < 0) seconds = 0;
    let formatted_time = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    return formatted_time;
  };
  return [time, timerOn, resetTimer, setTimerOn, getFormmatedTime];
};
