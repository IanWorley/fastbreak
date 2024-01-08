import Navbar from "@/src/components/Navbar";
import React from "react";
import PlayerClient from "./PlayerClient";

interface Props {
  params: { id: number; gameId: number };
}

function page({ params }: Props) {
  const { id, gameId } = params;
  return (
    <main>
      <Navbar teamId={id} viewingTeam={true} />
      <div className="flex flex-col justify-center p-8">
        <PlayerClient />
      </div>
    </main>
  );
}

export default page;
