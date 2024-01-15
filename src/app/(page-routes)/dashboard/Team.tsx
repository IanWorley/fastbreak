"use client";

import { Button } from "~/app/_components/shadcn/ui/button";
import Link from "next/link";
import { api } from "~/trpc/react";

type ITeamProps = {
  team: {
    id: number;
    name: string;
  };
};

function Team(props: ITeamProps) {
  const { team } = props;

  const { mutateAsync } = api.team.deleteTeam.useMutation();

  return (
    <div
      className=" mx-10 my-3 flex flex-col border  bg-primary-foreground md:mx-36  "
      key={team.id}
    >
      <h3 className="p-4 text-center text-2xl "> {team.name}</h3>
      <div className=" flex h-full w-full gap-3 ">
        <Link className="  h-full  w-full" href={`/team/${team.id}/game`}>
          <Button className="h-full w-full">View</Button>
        </Link>
        <Button
          className="h-full w-full"
          variant={"destructive"}
          onClick={() => {
            void mutateAsync(team.id.toString());
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default Team;
