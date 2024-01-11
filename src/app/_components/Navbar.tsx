import { SignInButton, UserButton, currentUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "~/app/_components/shadcn/ui/button";
import { ModeToggle } from "~/app/_components/ModeToggle";
import { getBaseUrl } from "~/lib/utils";

interface NavbarProps {
  className?: string;
  viewingTeam?: boolean; // Add the 'viewingTeam' prop to the interface definition
  teamId?: number;
}

async function Navbar({ className, viewingTeam, teamId }: NavbarProps) {
  // Import the 'viewingTeam' prop
  const user = await currentUser();

  return (
    <div
      className={
        className +
        "   h-17 top-0 flex w-full   items-center  justify-end border-b-2 bg-background  "
      }
    >
      {user ? (
        <div className="flex flex-row items-center gap-10 p-4">
          <Link href="/dashboard" className=" ">
            Dashboard
          </Link>
          {viewingTeam && (
            <div className="flex flex-row items-center gap-10 p-4">
              <div className="">
                <Link href={`/team/${teamId}/game`}>Games</Link>
              </div>
              <div className="">
                <Link href={`/team/${teamId}/player`}>Roster</Link>
              </div>
            </div>
          )}

          <UserButton afterSignOutUrl={`${getBaseUrl()}`} />
        </div>
      ) : (
        <div className="p-4  ">
          <SignInButton redirectUrl={`${getBaseUrl()}/dashboard`}>
            <Button variant={"default"}>Sign In</Button>
          </SignInButton>
        </div>
      )}

      <div className="items-center p-4">
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
