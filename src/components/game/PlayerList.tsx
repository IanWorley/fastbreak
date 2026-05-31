import { usePlayerForApp } from "~/store/PlayerForApp";
import PlayerCard from "./PlayerCard";

interface PlayerListProps {
  toggleForDrawer: () => void;
  setPlayerSwap: (playerId: string) => void;
  quarter: number;
  playerShooting: string;
  setPlayerShooting: (playerId: string) => void;
}

function PlayerList(props: PlayerListProps) {
  const {
    toggleForDrawer,
    setPlayerSwap,
    quarter,
    playerShooting,
    setPlayerShooting,
  } = props;
  const { players } = usePlayerForApp((state) => state);

  return (
    <>
      {usePlayerForApp((state) =>
        state.players.some((player) => player.isPlaying === true),
      ) ? (
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {players
            .filter((player) => player.isPlaying === true)
            .map((player) => (
              <PlayerCard
                key={player.id}
                playerShooting={playerShooting}
                setPlayerShooting={setPlayerShooting}
                player={player}
                toggleForDrawer={toggleForDrawer}
                setPlayerSwap={setPlayerSwap}
                quarter={quarter}
              />
            ))}
        </div>
      ) : (
        <div className="bg-primary-foreground p-10">
          <p className="p-4 text-3xl"> Add Players to team to start a game </p>
        </div>
      )}
    </>
  );
}
export default PlayerList;
