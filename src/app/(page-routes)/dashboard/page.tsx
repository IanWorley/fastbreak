import Navbar from "~/app/_components/Navbar";
import { Button } from "~/app/_components/shadcn/ui/button";
import Link from "next/link";
import Team from "./Team";
import { api } from "~/trpc/server";
import { toast } from "sonner";
import CreateTeamDenied from "./CreateTeamDenied";

async function page() {
  const teams = await api.team.grabTeams.query();

  return (
    <main className="overflow-y-scroll pt-20">
      <Navbar className="fixed" />
      <div className="">
        <div className="flex flex-col  items-center   justify-evenly p-10 sm:flex-row ">
          <p className="text-3xl font-bold  ">Your Teams </p>
          {teams.length === 0 ? (
            <Link href="/team/new">
              <Button> Create Team </Button>
            </Link>
          ) : (
            <CreateTeamDenied />
          )}
        </div>
        <div className="flex grid-cols-2 flex-col  md:grid  ">
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
