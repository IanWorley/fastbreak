import { notFound } from "next/navigation";

import Navbar from "~/app/_components/Navbar";
import { api } from "~/trpc/server";
import GameClient from "./GameClient";

export const runtime = "edge";

interface Props {
  params: { id: string; gameId: string };
}

async function page({ params }: Props) {
  const { id, gameId } = params;
  const game = await api.game.grabGame({
    teamId: id.toString(),
    gameId: gameId.toString(),
  });

  if (!game) {
    notFound();
  }

  return (
    <main className="">
      <Navbar teamId={id} viewingTeam={true} className="fixed top-0" />
      <h1 className="p-10 pt-20 text-center text-4xl font-extrabold">
        {game.name}
      </h1>
      <GameClient />
    </main>
  );
}

export default page;
