import Navbar from "@/src/components/Navbar";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { currentUser } from "@clerk/nextjs";
import type { player } from "@prisma/client";
import prisma from "@/src/lib/PrismaClient";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import FormNewPlayer from "./formNewPlayer";
// props grab team id from url
function page({ params }: { params: { id: number } }) {
  return (
    <main>
      <div className="flex flex-col h-screen">
        <Navbar className="h-14" />
        <div className="flex-grow flex items-center justify-center">
          <Card className="sm:w-auto  p-4">
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
