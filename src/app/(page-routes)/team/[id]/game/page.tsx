import Navbar from "~/app/_components/Navbar";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
// type from prisma schema
import { Button } from "~/app/_components/shadcn/ui/button";
import { db } from "~/server/db";
import Link from "next/link";
import { api } from "~/trpc/server";
import type { game, shot } from "@prisma/client";
interface Props {
  params: { id: number };
}

async function deleteGame(formData: FormData) {
  "use server";

  const id = z.coerce.number().parse(formData.get("id"));

  const game = await db.game.findUnique({
    where: {
      id: id,
    },
  });

  const team = await db.team.findUnique({
    where: {
      id: game!.teamId,
    },
  });

  await db.shot.deleteMany({
    where: {
      gameId: id,
    },
  });

  await db.game.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/dashboard");
}

async function Page(props: Props) {
  const { id } = props.params;

  const data = await api.game.grabGames.query(z.coerce.number().parse(id));

  return (
    <main className="overflow-y-scroll">
      <Navbar className="fixed" teamId={id} viewingTeam={true} />
      <div>
        <div className="flex flex-col  items-center   justify-evenly p-10 sm:flex-row ">
          <h1 className="p-4 text-3xl font-bold "> Games </h1>
          <Link href={`/team/${id}/game/new `}>
            <Button className="">Add Game</Button>
          </Link>
        </div>
        <div className="flex grid-cols-2 flex-col md:grid">
          {data.length >= 0 &&
            data.map((game) => (
              <Game key={game.id} game={game} shots={game.shots} id={id} />
            ))}
        </div>

        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-center text-2xl font-bold">
              {" "}
              No Games are Available{" "}
            </h3>
          </div>
        )}
      </div>
    </main>
  );
}

interface GameProps {
  game: game;
  shots: shot[];
  id: number;
}
async function Game(props: GameProps) {
  const { game, shots, id } = props;

  return (
    <div className="mx-8   my-4  bg-primary-foreground  md:mx-32" key={game.id}>
      <h3 className="p-4 text-center text-4xl font-semibold">{game.name}</h3>
      <div className="flex flex-row justify-center p-2 text-center">
        <h5 className="text-md font-semibold">
          Total Points:
          {shots.reduce((total, currentVal) => total + currentVal.points, 0)}
        </h5>
      </div>

      <div className="flex flex-row  gap-3">
        <Link
          className="block h-full w-full"
          href={`/team/${id}/game/${game.id}`}
        >
          <Button className="h-full w-full">View</Button>
        </Link>
        <form className="h-full w-full" action={deleteGame}>
          <input type="hidden" name="id" value={game.id} />
          <Button
            variant={"destructive"}
            type="submit"
            className="h-full w-full"
          >
            Delete
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Page;
