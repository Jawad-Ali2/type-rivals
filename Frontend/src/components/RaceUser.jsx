import { useEffect } from "react";
import createConnection from "../../utils/socket";

export const RaceUser = ({ players, setPlayers, token }) => {
  const socket = createConnection(token);

  useEffect(() => {
    socket.on("speed", ({ wpm, socketId }) => {
      // setSpeed(wpm);
      setPlayers(
        players.map((player) => {
          // console.log(player, socketId);
          return player.socketId === socketId
            ? { ...player, wpm: wpm }
            : player;
        })
      );
    });

    return () => {
      socket.off("speed");
    };
  }, [socket, players]);

  return (
    <div className="bg-slate-800 w-full mt-10 mb-10 rounded-md">
      {players.map((player, index) => {
        return (
          <div className="text-white" key={index}>
            <div className="p-2">
              <div className="flex gap-2">
                <img
                  className="w-10 rounded-full"
                  src={player.profilePic}
                  alt={player.profilePic}
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
