import PlayerCard from "./PlayerCard";
import { usePlayerForApp } from "~/store/PlayerForApp";

function PlayerList() {
  const { players } = usePlayerForApp((state) => state);

  return (
    <>
      {usePlayerForApp((state) => state.players.length === 0) && (
        <div className="bg-primary-foreground p-10 ">
          <p className="p-4 text-3xl"> No Players </p>
        </div>
      )}

      {usePlayerForApp((state) =>
        state.players.map((player) => (
          <PlayerCard player={player} key={player.id} />
        )),
      )}
    </>
  );
}
export default PlayerList;
