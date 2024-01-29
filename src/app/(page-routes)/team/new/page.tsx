import { z } from "zod";
import Navbar from "~/app/_components/Navbar";
import { db } from "~/server/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "~/app/_components/shadcn/ui/button";
import { Input } from "~/app/_components/shadcn/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/ui/card";
import { api } from "~/trpc/server";

async function page() {
  const CreateTeam = async (formData: FormData) => {
    "use server";
    const teamName = z.string().min(3).parse(formData.get("teamName"));

    const user = await currentUser();

    const team = await db.team.create({
      data: {
        name: teamName,
        users_id: user!.id, // Replace "example-user-id" with the actual user ID
      },
    });

    redirect("/team");
  };

  const teams = await api.team.grabTeams.query();

  if (teams.length >= 1) {
    redirect("/team");
  }

  return (
    <div className="flex h-screen flex-col">
      <Navbar className="h-14" />
      <div className="flex flex-grow items-center justify-center">
        <Card className="p-4  sm:w-auto">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">
              Create a Team
            </CardTitle>
          </CardHeader>
          <form action={CreateTeam} className="">
            <CardContent>
              <Input
                type="text"
                minLength={3}
                name="teamName"
                placeholder="Team Name"
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="" type="submit">
                Create
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default page;
