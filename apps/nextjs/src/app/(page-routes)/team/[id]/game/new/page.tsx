import { Card, CardHeader, CardTitle } from "@acme/ui/card";

import Navbar from "~/app/_components/Navbar";
import NewTeamFormClient from "~/app/(page-routes)/team/[id]/game/new/NewTeamFormClient";

function page() {
  return (
    <main>
      <div className="flex min-h-screen flex-col">
        <Navbar className="" />
        <div className="flex flex-grow items-center justify-center">
          <Card className="p-4 sm:w-auto">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold">
                Create a Game
              </CardTitle>
            </CardHeader>
            <NewTeamFormClient />
          </Card>
        </div>
      </div>
    </main>
  );
}

export default page;
