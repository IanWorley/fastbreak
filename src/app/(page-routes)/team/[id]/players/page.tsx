import Navbar from "@/src/components/Navbar";
import React from "react";
import PlayerClient from "./PlayerClient";

function page() {
  return (
    <main>
      <Navbar />
      <div className="flex flex-col justify-center p-8">
        <PlayerClient />
      </div>
    </main>
  );
}

export default page;
