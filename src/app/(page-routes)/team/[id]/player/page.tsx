import Navbar from "~/app/_components/Navbar";
import React from "react";
import PlayerClient from "./PlayerClient";

interface Props {
  params: { id: number; gameId: number };
}

function page({ params }: Props) {
  const { id, gameId } = params;
  return (
    <main className="overflow-y-scroll pt-20">
      <Navbar teamId={id} viewingTeam={true} className="fixed z-20" />
      <div className="flex flex-col justify-center p-8">
        <PlayerClient />
      </div>
    </main>
  );
}

export default page;
