import { redirect } from "next/navigation";

import { Card, CardHeader, CardTitle } from "@acme/ui/card";

import Navbar from "~/app/_components/Navbar";
import { api } from "~/trpc/server";
import FormContent from "./FormContent";

async function page() {
  const team = await api.team.grabTeams();

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
