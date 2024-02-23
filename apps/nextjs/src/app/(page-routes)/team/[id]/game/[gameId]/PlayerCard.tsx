"use client";

import { useParams } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import type { playerType } from "@acme/db";
import { Button } from "@acme/ui/button";

import { useShotsForGame } from "~/hooks/ShotHooks";
import { usePlayerForApp } from "~/store/PlayerForApp";

interface PlayerCardProps {
  player: playerType;
  toggleForDrawer: () => void;
  setPlayerSwap: (playerId: string) => void;
}

function PlayerCard(props: PlayerCardProps) {
  const parms = useParams<{ id: string; gameId: string }>();
  const teamId = z.string().cuid2().parse(parms.id);
  const gameId = z.string().cuid2().parse(parms.gameId);

  const { player, toggleForDrawer, setPlayerSwap } = props;
  const { players } = usePlayerForApp((state) => state);
  const shots = useShotsForGame(gameId, teamId);

  // Return three values for each player card  free throw, 2 point, 3 point

  const { freethrow, twopoint, threepoint } = shots
    .filter((shot) => shot.player_Id === player.id && shot.game_Id === gameId)
    .reduce(
      (acc, shot) => {
        if (shot.made) {
          if (shot.isFreeThrow) {
            acc.freethrow++;
          }
          if (shot.isFreeThrow === false && shot.points === 2) {
            acc.twopoint++;
          }
          if (shot.points === 3) {
            acc.threepoint++;
          }
        }
        return acc;
      },
      { freethrow: 0, twopoint: 0, threepoint: 0 },
    );

  return (
    <div key={player.id} className="bg-primary-foreground p-10 ">
      <p className="p-4 text-center text-3xl"> {player.name} </p>
      <div className="flex space-x-4  ">
        <Button
          className={"w-full  bg-green-500"}
          onClick={() => {
            if (players.length <= 5) {
              toast.info("You need at least 6 players to sub out");
              return;
            }
            setPlayerSwap(player.id);
            toggleForDrawer();
          }}
        >
          Sub Out
        </Button>
      </div>
      <div className=" text-md flex place-items-center justify-evenly space-x-4 ">
        <div>
          <p className=" text-center"> {freethrow} </p>
          <p className=" text-center"> Free Throw </p>
        </div>
        <div>
          <p className=" text-center"> {twopoint} </p>
          <p className="text-center"> 2 Point </p>
        </div>
        <div>
          <p className=" text-center"> {threepoint} </p>
          <p className="text-center"> 3 Point </p>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;
