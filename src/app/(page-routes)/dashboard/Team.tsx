"use client";

import { Button } from "@/src/components/ui/button";
import Link from "next/link";

type ITeamProps = {
  team: {
    id: number;
    name: string;
  };

  onDelete: (id: number) => void;
};

function Team({ team, onDelete }: ITeamProps) {
  return (
    <div
      className=" border bg-primary-foreground space-x-5 items-center flex-col flex justify-center mx-36 my-3 p-5"
      key={team.id}
    >
      <h3 className="text-2xl p-4"> {team.name}</h3>
      <div className="flex justify-evenly gap-3 ">
        <Link href={`/team/${team.id}/games`}>
          <Button>View</Button>
        </Link>
        <Button
          variant={"destructive"}
          onClick={() => {
            onDelete(team.id);
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default Team;
