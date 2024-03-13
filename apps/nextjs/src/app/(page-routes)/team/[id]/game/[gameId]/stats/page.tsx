"use client";

import { Button } from "@acme/ui/button";

import Navbar from "~/app/_components/Navbar";
import { api } from "~/trpc/server";

interface Props {
  params: { id: string; gameId: string };
}

async function page(props: Props) {
  const { id, gameId } = props.params;
  const game = await api.game.grabGame({
    teamId: id,
    gameId: gameId.toString(),
  });

  const players = await api.team.grabPlayers(id);

  if (players.length === 0) {
    return (
      <main className="">
        <Navbar className="sticky top-0 z-10" teamId={id} viewingTeam={true} />
        <h1 className="p-2 pt-5 text-center text-4xl font-extrabold">
          {game!.name}
        </h1>
        <p className="text-center">No players found</p>
      </main>
    );
  }

  const _shots = await api.game.grabPlayersShotsFromGame({
    teamId: id,
    gameId: gameId.toString(),
  });

  return (
    <main className="">
      <Navbar className="sticky top-0 z-10" teamId={id} viewingTeam={true} />
      <h1 className="p-2 pt-5 text-center text-4xl font-extrabold">
        {game!.name}
      </h1>
      <StatsInfo />
      <div className="flex items-center justify-center">
        <Button className="fixed bottom-5"> Select Player</Button>
      </div>
    </main>
  );
}

export default page;

interface _IStatsInfoProps {
  freeThrows: number;
  twoPts: number;
  threePts: number;
  totalShots: number;
  missedShots: number;
  shotPercentage: number;
}

export function StatsInfo() {
  return (
    <div className="grid grid-cols-3 grid-rows-2 items-center gap-2 bg-primary-foreground p-5">
      <div className="h-full w-full ">
        <h4 className="text-center text-sm font-semibold">Free Throws</h4>
        <p className="text-center">{4}</p>
      </div>
      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">2PTS</h4>
        <p className="text-center">{3}</p>
      </div>
      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">3PTS</h4>
        <p className="text-center">{5}</p>
      </div>
      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">Total Shots</h4>
        <p className="text-center">{20}</p>
      </div>

      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">Missed Shots</h4>
        <p className="text-center">{10}</p>
      </div>

      <div className="h-full w-full">
        <h4 className="text-center text-sm font-semibold">Shot %</h4>
        <p className="text-center">{(15 / 20) * 100}%</p>
      </div>
    </div>
  );
}
