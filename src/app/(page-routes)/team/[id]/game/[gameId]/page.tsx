import Navbar from "~/app/_components/Navbar";
import React from "react";
import GameClient from "./GameClient";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";

interface Props {
  params: { id: number; gameId: number };
}

async function page({ params }: Props) {
  const { id, gameId } = params;
  const game = await api.game.grabGame.query({
    teamId: id.toString(),
    gameId: gameId.toString(),
  });

  if (!game) {
    notFound();
  }

  return (
    <main className="">
      <Navbar teamId={id} viewingTeam={true} className="fixed top-0 " />
      <h1 className="p-10 text-center text-4xl font-extrabold">{game.name}</h1>
      <GameClient />
    </main>
  );
}

export default page;
