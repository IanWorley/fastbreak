import { z } from "zod";
import Navbar from "@/src/components/Navbar";
import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

function page() {
  const CreateTeam = async (formData: FormData) => {
    "use server";
    const teamName = z.string().min(3).parse(formData.get("teamName"));

    const user = await currentUser();

    const team = await prisma.team.create({
      data: {
        name: teamName,
        users_id: user!.id, // Replace "example-user-id" with the actual user ID
      },
    });

    redirect("/dashboard");
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar className="h-14" />
      <div className="flex-grow flex items-center justify-center">
        <Card className="sm:w-auto w-max">
          <CardHeader>
            <CardTitle> Create a Team </CardTitle>
          </CardHeader>
          <form action={CreateTeam} className="">
            <CardContent>
              <Input type="text" name="teamName" placeholder="Team Name" />
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
