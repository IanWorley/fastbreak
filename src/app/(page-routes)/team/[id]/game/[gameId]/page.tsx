import Navbar from "@/src/components/Navbar";
import React from "react";
// prisma client
import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";
import { z } from "zod";
import BasketBall from "./BasketballCourt";
import GameClient from "./GameClient";
import { serverClient } from "@/src/app/_trpc/serverClient";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

async function findGame(id: string) {
  "use server";

  const user = await currentUser();

  const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: false,

    prefix: "@upstash/ratelimit",
  });

  const { success } = await ratelimit.limit(user!.id);

  if (!success) {
    throw Error("Too many requests");
  }

  // covnert to number
  const gameId = z.coerce.number().parse(id);

  try {
    const game = await prisma.game.findUniqueOrThrow({
      where: {
        id: gameId,
      },
    });

    const team = await prisma.team.findUniqueOrThrow({
      where: {
        id: game!.teamId,
      },
    });

    return game;
  } catch (error) {
    console.error(error);

    return null;
  }
}

interface Props {
  params: { id: number; gameId: number };
}

async function page({ params }: Props) {
  const { id, gameId } = params;
  const game = await serverClient.GameRouter.grabGame({
    teamId: id.toString(),
    gameId: gameId.toString(),
  });

  if (game === null) {
    return <div>Game not found</div>;
  }

  return (
    <main className="pt-20">
      <Navbar teamId={id} viewingTeam={true} className="fixed top-0 " />
      <h1 className="text-center text-4xl p-10 font-extrabold">{game!.name}</h1>
      <GameClient />
    </main>
  );
}

export default page;
