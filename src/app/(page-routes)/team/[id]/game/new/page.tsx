import Navbar from "@/src/components/Navbar";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";
import { z } from "zod";
import NewTeamFormClient from "./NewTeamFormClient";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

function page() {
  return (
    <main>
      <div className="flex flex-col h-screen">
        <Navbar className="h-14" />
        <div className="flex-grow flex items-center justify-center">
          <Card className="sm:w-auto  p-4">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold">
                Create a Game
              </CardTitle>
            </CardHeader>
            <NewTeamFormClient />
          </Card>
        </div>
      </div>
    </main>
  );
}

export default page;
