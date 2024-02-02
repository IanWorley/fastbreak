import Navbar from "~/app/_components/Navbar";
import { Card, CardHeader, CardTitle } from "~/app/_components/shadcn/ui/card";
import FormNewPlayer from "./formNewPlayer";
// props grab team id from url
function page({ params }: { params: { id: string } }) {
  return (
    <main>
      <div className="flex h-screen flex-col">
        <Navbar className="h-14" viewingTeam={true} teamId={params.id} />
        <div className="flex flex-grow items-center justify-center">
          <Card className="p-4  sm:w-auto">
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
