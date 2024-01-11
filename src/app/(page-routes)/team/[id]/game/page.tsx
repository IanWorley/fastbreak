import Navbar from "~/app/_components/Navbar";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
// type from prisma schema
import { Button } from "~/app/_components/shadcn/ui/button";
import { db } from "~/server/db";
import Link from "next/link";
import { api } from "~/trpc/server";
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
    <main className="pt-20">
      <Navbar className="fixed" teamId={id} viewingTeam={true} />
      <h1 className="block p-7 text-center text-5xl font-extrabold"> Games </h1>
      <div className=" ">
        <div className="grid-cols-2 md:grid">
          {data.length >= 0 &&
            data.map((game) => (
              <div
                className="mx-8   my-4  bg-primary-foreground  md:mx-32"
                key={game.id}
              >
                <h3 className="p-4 text-center text-4xl font-semibold">
                  {" "}
                  {game.name}
                </h3>

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
            ))}
        </div>
        <div className="fixed bottom-0 right-0 z-10 m-4 p-4">
          <Link href={`/team/${id}/game/new `}>
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
