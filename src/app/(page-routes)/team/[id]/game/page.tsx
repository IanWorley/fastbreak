import Navbar from "@/src/components/Navbar";
import prisma from "@/src/lib/PrismaClient";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
// type from prisma schema
import type { game } from "@prisma/client";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
interface Props {
  params: { id: number };
}

export async function deleteGame(formData: FormData) {
  "use server";

  const id = z.coerce.number().parse(formData.get("id"));

  const game = await prisma.game.findUnique({
    where: {
      id: id,
    },
  });

  const team = await prisma.team.findUnique({
    where: {
      id: game!.teamId,
    },
  });

  await prisma.game.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/dashboard");
}

export async function getGames(id: number) {
  "use server";

  const team_id = z.coerce.number().safeParse(id);

  const user = await currentUser();

  if (team_id.success === false) {
    throw new Error("Invalid Team Id");
  }

  const team = await prisma.team.findUnique({
    where: {
      id: team_id.data,
    },
  });

  if (team?.users_id !== user!.id) {
    throw new Error("You do not have permission to view this page");
  }
  const games = prisma.game.findMany({
    where: {
      teamId: team_id.data,
    },
  });
  return games;
}

async function Page(props: Props) {
  const { id } = props.params;

  const data = await getGames(id);

  return (
    <main className="pt-20">
      <Navbar className="fixed" />
      <h1 className="text-5xl font-extrabold text-center block p-7"> Games </h1>
      <div className=" ">
        <div className="md:grid grid-cols-2">
          {data.length >= 0 &&
            data.map((game: game) => (
              <div
                className="bg-primary-foreground   md:mx-32  mx-8  my-4"
                key={game.id}
              >
                <h3 className="text-4xl font-semibold p-4 text-center">
                  {" "}
                  {game.name}
                </h3>

                <div className="flex flex-row  gap-3">
                  <Link
                    className="w-full h-full block"
                    href={`/team/${id}/games/${game.id}`}
                  >
                    <Button className="w-full h-full">View</Button>
                  </Link>
                  <form className="w-full h-full" action={deleteGame}>
                    <input type="hidden" name="id" value={game.id} />
                    <Button
                      variant={"destructive"}
                      type="submit"
                      className="w-full h-full"
                    >
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            ))}
        </div>
        <div className="fixed z-10 p-4 right-0 bottom-0 m-4">
          <Link href={`/team/${id}/games/new `}>
            <Button className="" variant={"secondary"}>
              Add Game
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Page;
