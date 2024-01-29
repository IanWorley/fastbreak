import { Button } from "~/app/_components/shadcn/ui/button";
import Link from "next/link";
import { api } from "~/trpc/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ITeamProps = {
  team: {
    id: number;
    name: string;
  };
};

async function deleteTeam(formData: FormData) {
  "use server";

  const id = formData.get("id");
  if (!id) {
    throw new Error("id is required");
  }

  const safeIdParse = z.coerce.number().safeParse(id);
  if (!safeIdParse.success) {
    throw new Error("id is not a number");
  }

  await api.team.deleteTeam.mutate(safeIdParse.data.toString());
  revalidatePath("/team");
}

async function Team(props: ITeamProps) {
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
        <form className="h-full w-full" action={deleteTeam}>
          <input type="hidden" name="id" value={team.id} />
          <Button
            className="h-full w-full"
            type="submit"
            variant={"destructive"}
          >
            Delete
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Team;
