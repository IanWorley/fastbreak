import { Button } from "~/app/_components/shadcn/ui/button";
import PlayerCard from "./PlayerCard";
import { usePlayerForApp } from "~/store/PlayerForApp";

interface PlayerListProps {
  toggleForDrawer: () => void;
  setPlayerSwap: (playerId: number) => void;
}

function PlayerList(props: PlayerListProps) {
  const { toggleForDrawer, setPlayerSwap } = props;
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
                player={player}
                toggleForDrawer={toggleForDrawer}
                setPlayerSwap={setPlayerSwap}
              />
            ))}
        </div>
      ) : (
        <div className="bg-primary-foreground p-10  ">
          <p className="p-4 text-3xl"> Add Players to team to start a game </p>
        </div>
      )}
    </>
  );
}
export default PlayerList;
