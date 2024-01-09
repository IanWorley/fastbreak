import { Button } from "@/src/components/ui/button";
import { ModeToggle } from "@/src/components/ModeToggle";
import { SignInButton, UserButton, currentUser } from "@clerk/nextjs";

import Link from "next/link";
import Navbar from "@/src/components/Navbar";
import { getBaseUrl } from "../lib/utils";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="overflow-y-auto">
      <main>
        <Navbar className="fixed top-0 " />
        <div className="flex flex-col justify-center items-center min-h-screen space-y-4 px-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-center lg:text-5xl">
            Fast Break
          </h1>

          <h2 className="scroll-m-20 text-2xl tracking-tight text-center text-gray-500 sm:text-3xl">
            A simple way to track your teams stats and progress
          </h2>

          {user ? (
            <Link href="/dashboard">
              <Button> Dashboard </Button>
            </Link>
          ) : (
            <SignInButton redirectUrl={`${getBaseUrl()}/dashboard`}>
              <Button variant={"default"}>Sign In</Button>
            </SignInButton>
          )}
        </div>

        {/* <footer className="flex items-center justify-center w-full h-24 border-t">
          <Button>Button</Button>
        </footer> */}
      </main>
    </div>
  );
}
