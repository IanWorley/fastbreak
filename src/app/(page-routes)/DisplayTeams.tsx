"use client";

import Link from "next/link";

import { Button } from "~/app/_components/ui/button";
import type { teamType } from "~/server/db/schema/schema";

import CreateTeamDenied from "~/app/(page-routes)/team/CreateTeamDenied";
import DeleteModel from "~/app/(page-routes)/team/DeleteTeamModel";
import Navbar from "~/app/_components/Navbar";
import { api } from "~/trpc/react";

export const runtime = "edge";

interface IDisplayTeamsProps {
  initialData: teamType[];
}

function DisplayTeams(props: IDisplayTeamsProps) {
  const { initialData } = props;
  const { data, isLoading, isError } = api.team.grabTeams.useQuery(undefined, {
    initialData: initialData,
  });

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (isLoading) {
    return (
      <div>
        <Navbar className="fixed" />
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline h-10 w-10 animate-spin fill-gray-600 text-gray-200 dark:fill-gray-300 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (isError || !data) {
    return (
      <div>
        <Navbar className="fixed" />
        <div>Error</div>
      </div>
    );
  }

  return (
    <main className="overflow-y-scroll pt-20">
      <Navbar className="fixed top-0" />

      <div className="">
        <div className="flex flex-col items-center justify-evenly p-10 sm:flex-row">
          <p className="p-4 text-3xl font-bold">Your Teams </p>

          {data.length === 0 ? (
            <Link href="/team/new">
              <Button> Create Team </Button>
            </Link>
          ) : (
            <CreateTeamDenied />
          )}
        </div>
        <div className="flex grid-cols-2 flex-col md:grid">
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

export default DisplayTeams;

interface ITeamProps {
  team: {
    id: string;
    name: string;
  };
}

export function Team(props: ITeamProps) {
  const { team } = props;

  return (
    <div
      className="mx-10 my-3 flex flex-col border bg-primary-foreground lg:mx-36"
      key={team.id}
    >
      <h3 className="p-4 text-center text-2xl font-semibold"> {team.name}</h3>
      <div className="flex h-full w-full gap-3">
        <Link className="h-full w-full" href={`/team/${team.id}/game`}>
          <Button className="h-full w-full">View</Button>
        </Link>
        <DeleteModel team={team}>
          <Button
            className="h-full w-full"
            type="submit"
            variant={"destructive"}
          >
            Delete
          </Button>
        </DeleteModel>
      </div>
    </div>
  );
}
