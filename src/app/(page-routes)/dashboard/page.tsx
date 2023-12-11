import Navbar from "@/src/components/Navbar";
import { Button } from "@/src/components/ui/button";
import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Team from "./Team";

async function getTeams() {
  const user = await currentUser();

  const teams = await prisma.team.findMany({
    where: {
      users_id: user!.id,
    },
  });
  return teams;
}

export async function delete_Team(id: number) {
  "use server";
  const team = await prisma.team.delete({
    where: {
      id: id,
    },
  });
  revalidatePath("/dashboard");
}

async function page() {
  const teams = await getTeams();

  return (
    <main className="overflow-y-scroll pt-20">
      <Navbar className="fixed" />
      <div className="">
        <div className="flex p-10 justify-evenly items-center ">
          <p className="text-3xl font-bold">Your Teams </p>
          <Link href="/team/new">
            <Button> Create Team </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2  ">
          {teams.map((team) => (
            <Team team={team} key={team.id} onDelete={delete_Team} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default page;
