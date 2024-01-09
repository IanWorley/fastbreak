import { SignInButton, UserButton, auth, currentUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { use } from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { getBaseUrl } from "../lib/utils";

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
        "   top-0 w-full h-17 border-b-2   items-center  flex justify-end bg-background  "
      }
    >
      {user ? (
        <div className="p-4 flex-row flex items-center gap-10">
          <Link href="/dashboard" className=" ">
            Dashboard
          </Link>
          {viewingTeam && (
            <div className="p-4 flex-row flex items-center gap-10">
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

      <div className="p-4 items-center">
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
