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
import { FaBars, FaXmark } from "react-icons/fa6";
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
        } w-full flex-col items-center justify-between gap-10 p-4 md:flex md:flex-row md:items-center md:justify-end`}
      >
        {user.isLoaded && user.isSignedIn ? (
          <>
            <Link
              href="/dashboard"
              className="py-2 text-center text-2xl md:text-sm"
            >
              Dashboard
            </Link>
            {viewingTeam && (
              <>
                <Link
                  href={`/team/${teamId}/game`}
                  className=" text-center text-2xl md:text-sm"
                >
                  Games
                </Link>
                <Link
                  href={`/team/${teamId}/player`}
                  className=" text-center text-2xl md:text-sm "
                >
                  Roster
                </Link>
              </>
            )}

            <button className="py-2 text-center text-2xl md:hidden">
              <p> {user.user?.fullName} </p>
            </button>

            <div className="hidden  md:block">
              <UserButton afterSignOutUrl={`${getBaseUrl()}`} />
            </div>
          </>
        ) : (
          <SignInButton redirectUrl={`${getBaseUrl()}/dashboard`}>
            <Button variant={"default"} className="py-2 text-center text-2xl">
              Sign In
            </Button>
          </SignInButton>
        )}
      </div>
      <Button
        variant={"default"}
        onClick={handleToggle}
        className="mb-auto ml-auto p-4 md:hidden"
      >
        {isOpen ? <FaXmark /> : <FaBars />}
      </Button>
    </nav>
  );
}

export default Navbar;
