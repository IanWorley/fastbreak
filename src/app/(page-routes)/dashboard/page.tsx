import Navbar from "@/src/components/Navbar";
import { Button } from "@/src/components/ui/button";
import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Team from "./Team";
import { serverClient } from "../../_trpc/serverClient";

async function page() {
  const teams = await serverClient.TeamRouter.grabTeams();
  console.log(teams.length);

  return (
    <main className="overflow-y-scroll pt-20">
      <Navbar className="fixed" />
      <div className="">
        <div className="flex sm:flex-row  flex-col   p-10 justify-evenly items-center ">
          <p className="text-3xl font-bold  ">Your Teams </p>
          {teams.length === 0 ? (
            <Link href="/team/new">
              <Button> Create Team </Button>
            </Link>
          ) : (
            <Button variant={"ghost"} disabled={true}>
              {" "}
              Create Team{" "}
            </Button>
          )}
        </div>
        <div className="md:grid flex flex-col  grid-cols-2  ">
          {teams.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">No Teams</p>
            </div>
          )}

          {teams.map((team) => (
            <Team team={team} key={team.id} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default page;
