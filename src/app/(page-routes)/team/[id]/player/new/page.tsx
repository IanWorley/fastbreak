import { Card, CardHeader, CardTitle } from "~/app/_components/ui/card";

import Navbar from "~/app/_components/Navbar";
import FormNewPlayer from "./formNewPlayer";

// props grab team id from url
async function page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main>
      <div className="flex h-screen flex-col">
        <Navbar className="" viewingTeam={true} teamId={(await params).id} />
        <div className="flex flex-grow items-center justify-center">
          <Card className="p-4 sm:w-auto">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold">
                Add a Player
              </CardTitle>
            </CardHeader>
            <FormNewPlayer />
          </Card>
        </div>
      </div>
    </main>
  );
}

export default page;
