import { redirect } from "next/navigation";
import Navbar from "~/app/_components/Navbar";
import { Card, CardHeader, CardTitle } from "~/app/_components/shadcn/ui/card";
import { api } from "~/trpc/server";
import FormContent from "./FormContent";

async function page() {
  const team = await api.team.grabTeams.query();

  if (team.length >= 1) {
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
          <FormContent />
        </Card>
      </div>
    </div>
  );
}

export default page;
