import Navbar from "~/app/_components/Navbar";
import PlayerClient from "./PlayerClient";

interface Props {
  params: { id: string; gameId: string };
}

function page({ params }: Props) {
  const { id, gameId } = params;
  return (
    <main className="overflow-y-scroll ">
      <Navbar teamId={id} viewingTeam={true} className="fixed z-20" />
      <div className="flex flex-col justify-center p-8">
        <PlayerClient />
      </div>
    </main>
  );
}

export default page;
