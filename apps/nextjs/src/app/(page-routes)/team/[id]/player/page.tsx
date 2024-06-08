import Navbar from "~/app/_components/Navbar";
import PlayerClient from "./PlayerClient";

interface Props {
  params: { id: string };
}

function page({ params }: Props) {
  const { id } = params;
  return (
    <main className="overflow-y-scroll">
      <Navbar teamId={id} viewingTeam={true} className="sticky top-0" />
      <div className="flex flex-col justify-center p-8">
        <PlayerClient />
      </div>
    </main>
  );
}

export default page;
