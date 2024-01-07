import Navbar from "@/src/components/Navbar";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";
import { z } from "zod";
import NewTeamFormClient from "./NewTeamFormClient";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export async function createGame(form: FormData) {
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

  const id = z.coerce.number().parse(form.get("teamId"));

  // find by id
  const team = await prisma.team.findUniqueOrThrow({
    where: { id }, // Pass the id as an object of type teamWhereUniqueInput
  });

  // zod form data to extract what I need
  const gameName = z.string().min(3).parse(form.get("gameName"));

  if (team?.users_id === user!.id) {
    await prisma.game.create({
      data: {
        name: gameName,
        team: { connect: { id: team.id } },
      },
    });
    redirect(`/team/${id}/game`);
  } else {
    redirect("/dashboard");
  }
}

function page() {
  return (
    <main>
      <div className="flex flex-col h-screen">
        <Navbar className="h-14" />
        <div className="flex-grow flex items-center justify-center">
          <Card className="sm:w-auto  p-4">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold">
                Create a Game
              </CardTitle>
            </CardHeader>
            <NewTeamFormClient onSubmit={createGame} />
          </Card>
        </div>
      </div>
    </main>
  );
}

export default page;
