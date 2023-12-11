import Navbar from "@/src/components/Navbar";
import TeamInfo from "@/src/app/(page-routes)/team/[id]/games/TeamInfo";
import { useParams } from "next/navigation";
import { number } from "zod";

function Page() {
  return (
    <main className="pt-20">
      <Navbar className="fixed" />
      <h1 className="text-5xl font-extrabold text-center block p-7"> Games </h1>
      <TeamInfo />
    </main>
  );
}

export default Page;
