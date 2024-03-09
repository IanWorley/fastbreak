import { useParams } from "next/navigation";
import { z } from "zod";

import type { playerType } from "@acme/db";
import { Button } from "@acme/ui/button";

import { useShotsForGame } from "~/hooks/ShotHooks";
import { usePlayerForApp } from "~/store/PlayerForApp";

interface DrawerPlayerCardProps {
  player: playerType;
  playerToSwap: string;
  quarter: number;
  onOpenChange: (open: boolean) => void;
}

function DrawerPlayerCard(props: DrawerPlayerCardProps) {
  const parms = useParams<{ id: string; gameId: string }>();

  const teamId = z.string().cuid2().parse(parms.id);
  const gameId = z.string().cuid2().parse(parms.gameId);

  const { player, playerToSwap, onOpenChange } = props;
  const { swapPlayersActive } = usePlayerForApp((state) => state);

  const shots = useShotsForGame(gameId, teamId, undefined); //! Heads up this is getting all the shots from that game

  const {
    freethrowMade,
    twopointMade,
    threepointMade,
    freethrowTotal,
    twopointTotal,
    threepointTotal,
  } = shots
    .filter((shot) => shot.player_Id === player.id && shot.game_Id === gameId)
    .reduce(
      (acc, shot) => {
        if (shot.made) {
          if (shot.isFreeThrow) {
            acc.freethrowMade++;
          }
          if (shot.isFreeThrow === false && shot.points === 2) {
            acc.twopointMade++;
          }
          if (shot.points === 3) {
            acc.threepointMade++;
          }
        }

        if (shot.isFreeThrow) {
          acc.freethrowTotal++;
        }
        if (shot.isFreeThrow === false && shot.points === 2) {
          acc.twopointTotal++;
        }
        if (shot.points === 3) {
          acc.threepointTotal++;
        }

        return acc;
      },
      {
        freethrowMade: 0,
        twopointMade: 0,
        threepointMade: 0,
        freethrowTotal: 0,
        twopointTotal: 0,
        threepointTotal: 0,
      },
    );

  return (
    <div key={player.id} className="bg-primary-foreground  md:mx-2 md:p-2 ">
      <p className="p-2 text-center text-xl md:p-4 md:text-3xl">
        {player.name}
      </p>
      <Button
        className="w-full"
        onClick={() => {
          swapPlayersActive(player.id, playerToSwap);
          onOpenChange(false);
        }}
      >
        Sub In
      </Button>

      <div className=" flex items-center justify-evenly ">
        <div>
          <p className=" text-center">
            {freethrowMade} / {freethrowTotal}
          </p>
          <p className=" text-center"> Free Throw </p>
        </div>
        <div>
          <p className=" text-center">
            {twopointMade} / {twopointTotal}
          </p>
          <p className="text-center"> 2 Point </p>
        </div>
        <div>
          <p className=" text-center">
            {threepointMade} / {threepointTotal}
          </p>
          <p className="text-center"> 3 Point </p>
        </div>
      </div>
    </div>
  );
}

export default DrawerPlayerCard;
