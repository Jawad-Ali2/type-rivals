import { useEffect, useState } from "react";
import defaultImage from "/anonymous-user.jpg";
import createConnection from "../../utils/socket";
import { BounceLoader } from "react-spinners";
import { MdOutlineSpeed } from "react-icons/md";
export const RaceUser = ({ players, setPlayers, token }) => {
  const [raceCompletion, setRaceCompletion] = useState(0);
  const socket = createConnection(token);

  const calculateNewPos = (completion) => {
    return completion * 5.45; // random value to keep the pic in place
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
    <div className="bg-primary-b border-2 border-primary-c w-full mt-10 mb-10 rounded-md">
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
            <div className="text-white " key={index}>
              <div className={`p-5 relative ${player.userLeft && "text-blue"}`}>
                <div className="flex justify-between items-center gap-2 pb-3">
                  <p className="">{player.username}</p>
                  <div className="speed-meter space-x-2 flex flex-row items-center">
                    <p className="font-semibold text-sm">
                      {player.wpm ? player.wpm : 0} WPM
                    </p>
                    <MdOutlineSpeed className="text-primary-e" size={30} />
                  </div>
                </div>
                <div className="flex flex-row relative h-full w-full my-5 items-center">
                  <img
                    id={`pfp-${player.playerId}`}
                    className={`w-10 h-10 m-2 rounded-full top-[-1.5rem] absolute z-50 transition-all  duration-200 custom-image-${player.playerId}`}
                    src={player.profilePic ? player.profilePic : defaultImage}
                    alt={player.username}
                  />
                  <div className="progress-bar pl-2  absolute w-full flex flex-row items-center ">
                    <div className="bg-primary-e w-full h-1 mt-2 rounded-full"></div>
                    <div className="bg-primary-e rounded-full w-3 h-3 mt-2" />
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
