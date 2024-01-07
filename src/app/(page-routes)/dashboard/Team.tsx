"use client";

import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { trpc } from "../../_trpc/client";

type ITeamProps = {
  team: {
    id: number;
    name: string;
  };
};

function Team(props: ITeamProps) {
  const { team } = props;

  const { mutateAsync } = trpc.TeamRouter.deleteTeam.useMutation();

  return (
    <div
      className=" flex flex-col border bg-primary-foreground mx-10  md:mx-36 my-3  "
      key={team.id}
    >
      <h3 className="text-2xl p-4"> {team.name}</h3>
      <div className=" flex gap-3 w-full h-full ">
        <Link className="  h-full  w-full" href={`/team/${team.id}/game`}>
          <Button className="w-full h-full">View</Button>
        </Link>
        <Button
          className="w-full h-full"
          variant={"destructive"}
          onClick={() => {
            mutateAsync(team.id.toString());
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default Team;
