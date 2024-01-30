import { Button } from "~/app/_components/shadcn/ui/button";
import { SignInButton, currentUser } from "@clerk/nextjs";

import Link from "next/link";
import Navbar from "~/app/_components/Navbar";
import { getBaseUrl } from "~/lib/utils";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="overflow-y-auto">
      <main>
        <Navbar className=" " />
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 px-4">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
            Fast Break
          </h1>

          <h2 className="scroll-m-20 text-center text-2xl tracking-tight text-gray-500 sm:text-3xl">
            A simple way to track your teams stats and progress
          </h2>

          {user ? (
            <Link href="/team">
              <Button> View Teams </Button>
            </Link>
          ) : (
            <SignInButton redirectUrl={`${getBaseUrl()}/team`}>
              <Button variant={"default"}>Sign In</Button>
            </SignInButton>
          )}
        </div>
      </main>
    </div>
  );
}
