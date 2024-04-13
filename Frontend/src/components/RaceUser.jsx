import { useEffect, useState } from "react";
import defaultImage from "/anonymous-user.jpg";
import createConnection from "../../utils/socket";
import { BounceLoader } from "react-spinners";

export const RaceUser = ({ players, setPlayers, token }) => {
  const [raceCompletion, setRaceCompletion] = useState(0);
  const socket = createConnection(token);

  const calculateNewPos = (completion) => {
    return completion * 5.3; // random value to keep the pic in place
  };

  useEffect(() => {
    socket.on("speed", ({ wpm, percentage, socketId }) => {
      setRaceCompletion(() => percentage);

      setPlayers(
        players.map((player) => {
          const updatedPlayer =
            player.socketId === socketId
              ? { ...player, wpm: wpm, percentageCompleted: percentage }
              : player;

          return updatedPlayer;
        })
      );
    });

    return () => {
      socket.off("speed");
    };
  }, [socket, players]);

  useEffect(() => {
    players.forEach((player) => {
      const newPos = calculateNewPos(player.percentageCompleted);

      const image = document.querySelector(`#pfp-${player.playerId}`);

      image.style.transform = `translateX(${newPos}px)`;
    });
  }, [raceCompletion]);

  return (
    <div className="bg-slate-800 w-full mt-10 mb-10 rounded-md">
      {!players.length ? (
        <div className="p-[2.5rem]">
          <BounceLoader
            loading={!players.length}
            color="white"
            cssOverride={{ margin: "auto" }}
            size={30}
          />
        </div>
      ) : (
        players.map((player, index) => {
          return (
            <div className="text-white" key={index}>
              <div className={`p-5 ${player.userLeft && "text-blue"}`}>
                <div className="flex items-center gap-2">
                  <p className="">
                    {player.username} ({player.email})
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <img
                    id={`pfp-${player.playerId}`}
                    className={`w-10 m-2 rounded-full transition-all duration-200 custom-image-${player.playerId}`}
                    src={player.profilePic ? player.profilePic : defaultImage}
                    alt={player.username}
                  />
                  <p>{player.wpm}</p>
                </div>
                <div className="pr-10">
                  <div className="bg-slate-500 w-full h-2 mt-2 rounded-full"></div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
