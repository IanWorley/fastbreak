import PlayerCard from "./PlayerCard";
import { usePlayerForApp } from "@/src/store/PlayerForApp";

function PlayerList() {
  return (
    <>
      {usePlayerForApp((state) => state.players.length === 0) && (
        <div className="bg-primary-foreground p-10 ">
          <p className="text-3xl p-4"> No Players </p>
        </div>
      )}

      {usePlayerForApp((state) =>
        state.players.map((player) => (
          <PlayerCard player={player} key={player.id} />
        ))
      )}
    </>
  );
}
export default PlayerList;
