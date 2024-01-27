import { Button } from "~/app/_components/shadcn/ui/button";
import PlayerCard from "./PlayerCard";
import { usePlayerForApp } from "~/store/PlayerForApp";

interface PlayerListProps {
  toggleForDrawer: () => void;
}

function PlayerList(props: PlayerListProps) {
  const { toggleForDrawer } = props;
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
              <PlayerCard key={player.id} player={player} />
            ))}
        </div>
      ) : (
        <div className="bg-primary-foreground p-10  ">
          <p className="p-4 text-3xl"> No Players Are Playing </p>
          <Button
            className=""
            onClick={(event) => {
              toggleForDrawer();
              event.stopPropagation();
            }}
          >
            Set Players Active
          </Button>
        </div>
      )}
    </>
  );
}
export default PlayerList;
