"use client";
import {
  ClerkProvider,
  SignInButton,
  UserButton,
  UserProfile,
  currentUser,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "~/app/_components/shadcn/ui/button";
import { ModeToggle } from "~/app/_components/ModeToggle";
import { getBaseUrl } from "~/lib/utils";
import { FaBars } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { Clerk } from "@clerk/nextjs/server";

interface NavbarProps {
  className?: string;
  viewingTeam?: boolean; // Add the 'viewingTeam' prop to the interface definition
  teamId?: number;
}

function Navbar({ className, viewingTeam, teamId }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const user = useUser();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={
        className +
        " h-17 top-0 flex w-full items-center justify-between overflow-hidden border-b-2 bg-background md:justify-end "
      }
    >
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } w-full flex-col items-center justify-between gap-10 p-4 md:flex md:flex-row md:justify-end`}
      >
        {user.isLoaded && user.isSignedIn ? (
          <>
            <Link href="/dashboard" className="">
              Dashboard
            </Link>
            {viewingTeam && (
              <div className="flex flex-col items-center gap-10 p-4 md:flex-row">
                <div className="">
                  <Link href={`/team/${teamId}/game`}>Games</Link>
                </div>
                <div className="">
                  <Link href={`/team/${teamId}/player`}>Roster</Link>
                </div>
              </div>
            )}

            <button className="md:hidden ">
              <p> {user.user?.fullName} </p>
            </button>

            <div className="hidden  md:block">
              <UserButton afterSignOutUrl={`${getBaseUrl()}`} />
            </div>
          </>
        ) : (
          <SignInButton redirectUrl={`${getBaseUrl()}/dashboard`}>
            <Button variant={"default"}>Sign In</Button>
          </SignInButton>
        )}
      </div>
      <Button
        variant={"default"}
        onClick={handleToggle}
        className="mb-auto ml-auto p-4 md:hidden"
      >
        {isOpen ? "Close" : "Menu"}
      </Button>
    </nav>
  );
}

export default Navbar;
