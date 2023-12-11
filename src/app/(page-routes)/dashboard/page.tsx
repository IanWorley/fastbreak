import Navbar from "@/src/components/Navbar";
import { Button } from "@/src/components/ui/button";
import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";
import Link from "next/link";

async function getTeams() {
  const user = await currentUser();

  const teams = await prisma.team.findMany({
    where: {
      users_id: user!.id,
    },
  });
  return teams;
}

async function page() {
  const teams = await getTeams();

  return (
    <main>
      <Navbar />
      <div>
        <div className="flex p-10 justify-evenly items-center ">
          <p className="text-3xl font-bold">Your Teams </p>
          <Link href="/team/new">
            <Button> Create Team </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2  ">
          {teams.map((team) => (
            <div
              className=" border bg-primary-foreground items-center flex-col flex justify-center m-5 p-5"
              key={team.id}
            >
              <p> {team.name}</p>
              <div className="flex justify-evenly">
                <Link href={`/team/${team.id}`}>
                  <Button>View</Button>
                </Link>
                <Link href={`/team/${team.id}/edit`}>
                  <Button>Edit</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default page;
