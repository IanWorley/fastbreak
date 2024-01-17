"use client";
import {
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

interface NavbarProps {
  className?: string;
  viewingTeam?: boolean; // Add the 'viewingTeam' prop to the interface definition
  teamId?: number;
}

function Navbar({ className, viewingTeam, teamId }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { user, isLoaded, isSignedIn } = useUser();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={
        className +
        " h-17 top-0 flex w-full  items-center  justify-between overflow-hidden border-b-2 bg-background md:justify-end "
      }
    >
      {isSignedIn && isLoaded ? (
        <div className="mb-auto mr-auto flex flex-col rounded bg-blue-500 px-4 py-2 text-white md:hidden">
          <UserButton afterSignOutUrl={`${getBaseUrl()}`} />
        </div>
      ) : null}

      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } flex w-full flex-col items-center justify-center gap-10 p-4 md:flex md:flex-row md:items-center md:justify-end`}
      >
        {isLoaded && !isSignedIn ? (
          <div className="block cursor-pointer text-2xl md:hidden">
            <SignInButton redirectUrl={`${getBaseUrl()}/dashboard`}>
              <p className="">Sign In</p>
            </SignInButton>
          </div>
        ) : null}

        {isLoaded && isSignedIn ? (
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

            <div className="hidden md:block">
              <UserButton afterSignOutUrl={`${getBaseUrl()}`} />
            </div>
          </>
        ) : (
          <SignInButton redirectUrl={`${getBaseUrl()}/dashboard`}>
            <Button
              variant={"default"}
              className="hidden py-2 text-center text-sm md:block"
            >
              Sign In
            </Button>
          </SignInButton>
        )}
      </div>

      <Button
        variant={"default"}
        onClick={handleToggle}
        className="mb-auto ml-auto h-full p-4 md:hidden"
      >
        {isOpen ? <FaXmark /> : <FaBars />}
      </Button>
    </nav>
  );
}

export default Navbar;
