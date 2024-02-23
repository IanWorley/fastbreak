import Link from "next/link";

import { Button } from "@acme/ui/button";

import DeleteModel from "~/app/(page-routes)/team/DeleteTeamModel";

interface ITeamProps {
  team: {
    id: string;
    name: string;
  };
}

function Team(props: ITeamProps) {
  const { team } = props;

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

export default Team;
