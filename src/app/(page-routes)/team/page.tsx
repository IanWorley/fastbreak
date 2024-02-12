"use client";
import Link from "next/link";
import CreateTeamDenied from "~/app/(page-routes)/team/CreateTeamDenied";
import Team from "~/app/(page-routes)/team/Team";
import Navbar from "~/app/_components/Navbar";
import { Button } from "~/app/_components/shadcn/ui/button";
import { api } from "~/trpc/react";

function page() {
  const { data, isLoading, isError } = api.team.grabTeams.useQuery();

  if (isLoading) {
    return (
      <div>
        <Navbar className="fixed" />
        <div>Loading...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        <Navbar className="fixed" />
        <div>Error</div>
      </div>
    );
  }

  return (
    <main className="overflow-y-scroll">
      <Navbar className="fixed" />

      <div className="">
        <div className="flex flex-col  items-center   justify-evenly p-10 sm:flex-row ">
          <p className=" p-4 text-3xl font-bold ">Your Teams </p>

          {data.length === 0 ? (
            <Link href="/team/new">
              <Button> Create Team </Button>
            </Link>
          ) : (
            <CreateTeamDenied />
          )}
        </div>
        <div className="flex grid-cols-2 flex-col  md:grid  ">
          {data.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">No Teams</p>
            </div>
          )}

          {data.map((team) => (
            <Team team={team} key={team.id} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default page;
