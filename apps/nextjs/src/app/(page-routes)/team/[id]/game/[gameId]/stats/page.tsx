"use client";

import { useState } from "react";

import type { shotType } from "@acme/db";
import { Button } from "@acme/ui/button";

import Navbar from "~/app/_components/Navbar";
import { api } from "~/trpc/react";
import DrawerPlayer from "./PlayerSelectDrawer";

interface Props {
  params: { id: string; gameId: string };
}

function Page(props: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [playerToSwap, setPlayerToSwap] = useState("");

  const { id, gameId } = props.params;
  const {
    data: game,
    isLoading: isGameLoading,
    isError: isGameError,
  } = api.game.grabGame.useQuery({
    teamId: id,
    gameId: gameId.toString(),
  });

  const {
    data: players,
    isError: playerIsError,
    isLoading: playerIsLoading,
  } = api.team.grabPlayers.useQuery(id);

  const {
    data: shots,
    isError: shotsIsError,
    isLoading: shotIsLoading,
  } = api.game.grabPlayersShotsFromGame.useQuery({
    gameId: gameId,
    teamId: id,
    quarter: undefined,
  });

  if (isGameLoading || shotIsLoading || playerIsLoading) {
    return (
      <main className="">
        <Navbar className="sticky top-0 z-10" teamId={id} viewingTeam={true} />
        <p className="text-center">Loading...</p>
      </main>
    );
  }

  if (isGameError || playerIsError || shotsIsError) {
    return (
      <main className="">
        <Navbar className="sticky top-0 z-10" teamId={id} viewingTeam={true} />
        {isGameError ? (
          <p className="text-center">Error loading game</p>
        ) : playerIsError ? (
          <p className="text-center">Error loading players</p>
        ) : (
          <p className="text-center">Error loading shots</p>
        )}
      </main>
    );
  }

  if (players?.length ?? [].length === 0) {
    return (
      <main className="">
        <Navbar className="sticky top-0 z-10" teamId={id} viewingTeam={true} />
        <h1 className="p-2 pt-5 text-center text-4xl font-extrabold">
          {game?.name ?? "Unknown Game"}
        </h1>
        <p className="text-center">No players found</p>
      </main>
    );
  }

  return (
    <main className="">
      <Navbar className="sticky top-0 z-10" teamId={id} viewingTeam={true} />
      <h1 className="p-2 pt-5 text-center text-4xl font-extrabold">
        {game?.name ?? "Unknown Game"}
      </h1>
      {/* find players id and return name from a list */}
      {playerToSwap !== "" ? (
        <h3 className="p-2 text-center text-2xl">
          {players?.find((player) => player.id === playerToSwap)?.name}
        </h3>
      ) : (
        <h3 className="p-2 text-center text-2xl">Select a Player</h3>
      )}

      <StatsInfo gameId={gameId} shots={shots ?? []} playerId={playerToSwap} />
      <div className="flex items-center justify-center">
        <Button
          onClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
          }}
          className="fixed bottom-5"
        >
          Select Player
        </Button>
      </div>

      <DrawerPlayer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        setPlayerToSwap={setPlayerToSwap}
        playerToSwap={playerToSwap}
        players={players ?? []}
      />
    </main>
  );
}

export default Page;

interface IPropsStatsInfo {
  shots: shotType[];
  playerId: string;
  gameId: string;
}

export function StatsInfo(props: IPropsStatsInfo) {
  const { shots, playerId, gameId } = props;

  const {
    freethrowMade,
    twopointMade,
    threepointMade,
    freethrowTotal,
    twopointTotal,
    threepointTotal,
  } = shots
    .filter((shot) => shot.player_Id === playerId && shot.game_Id === gameId)
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
    <div className="grid grid-cols-3 grid-rows-2 items-center gap-2 bg-primary-foreground p-5 lg:mx-60">
      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">Free Throws</h4>
        <p className="text-center">{freethrowMade}</p>
      </div>
      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">2PTS</h4>
        <p className="text-center">{twopointMade}</p>
      </div>
      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">3PTS</h4>
        <p className="text-center">{threepointMade}</p>
      </div>
      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">Total Shots</h4>
        <p className="text-center">
          {freethrowTotal + twopointTotal + threepointTotal}
        </p>
      </div>

      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">Missed Shots</h4>
        <p className="text-center">
          {freethrowTotal +
            twopointTotal +
            threepointTotal -
            (freethrowMade + twopointMade + threepointMade)}
        </p>
      </div>

      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">Shot %</h4>
        <p className="text-center">
          {((freethrowMade + twopointMade + threepointMade) /
            (freethrowTotal + twopointTotal + threepointTotal)) *
            100 || 0}
          %
        </p>
      </div>
    </div>
  );
}
