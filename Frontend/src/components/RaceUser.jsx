import { useEffect, useState } from "react";
import createConnection from "../../utils/socket";

export const RaceUser = ({ players, setPlayers, token }) => {
  const [raceCompletion, setRaceCompletion] = useState(0);
  const [picPosition, setPicPosition] = useState(0);
  const socket = createConnection(token);

  useEffect(() => {
    socket.on("speed", ({ wpm, percentage, socketId }) => {
      setRaceCompletion(percentage);
      setPlayers(
        players.map((player) => {
          return player.socketId === socketId
            ? { ...player, wpm: wpm, percentageCompleted: percentage }
            : player;
        })
      );
    });

    return () => {
      socket.off("speed");
    };
  }, [socket, players]);

  useEffect(() => {
    const calculateNewPos = (completion) => {
      return completion * 5.7; // random value to keep the pic in place
    };
    const newPos = calculateNewPos(raceCompletion);

    setPicPosition(newPos);
  }, [raceCompletion]);

  return (
    <div className="bg-slate-800 w-full mt-10 mb-10 rounded-md">
      {players.map((player, index) => {
        return (
          <div className="text-white" key={index}>
            <div className="p-5">
              <div className="flex gap-2">
                <img
                  id="pfp"
                  className="w-10 rounded-full transition-all duration-200 "
                  src={player.profilePic}
                  alt={player.profilePic}
                  style={{ transform: `translateX(${picPosition}px)` }}
                />

                <div className="flex items-center justify-between gap-2">
                  <p className="">
                    {player.username} ({player.email})
                  </p>
                  <div>
                    <p>{player.wpm}</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-500 w-full h-2 mt-2 rounded-full "></div>
            </div>
            <div className="race-user-card-info">
              {/* <div className="race-user-card-info-points">{player.points}</div> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};
