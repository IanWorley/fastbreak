import Navbar from "@/src/components/Navbar";
import TeamInfo from "@/src/app/(page-routes)/team/[id]/games/TeamInfo";
import prisma from "@/src/lib/PrismaClient";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

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
