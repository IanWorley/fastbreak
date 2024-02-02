"use client";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { ModeToggle } from "~/app/_components/ModeToggle";
import { Button } from "~/app/_components/shadcn/ui/button";
import { getBaseUrl } from "~/lib/utils";

interface NavbarProps {
  className?: string;
  viewingTeam?: boolean; // Add the 'viewingTeam' prop to the interface definition
  teamId?: string;
}

function Navbar({ className, viewingTeam, teamId }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { user, isLoaded, isSignedIn } = useUser();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full border-b  bg-transparent ">
      <div className="mx-auto max-w-screen-xl items-center px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:block md:py-5">
          <div className="flex w-full justify-between ">
            {isLoaded && isSignedIn ? (
              <div className=" flex justify-end md:hidden">
                <UserButton />
              </div>
            ) : (
              <div className="flex justify-end md:hidden">
                <SignInButton redirectUrl={`${getBaseUrl()}/team`}>
                  <Button variant={"default"}>Sign In</Button>
                </SignInButton>
              </div>
            )}
            <ModeToggle />
            {isLoaded && isSignedIn ? (
              <button
                className="rounded-md p-2 text-gray-700 outline-none focus:border focus:border-gray-400 md:hidden"
                onClick={handleToggle}
              >
                {isOpen ? <FaXmark /> : <FaBars />}
              </button>
            ) : null}
          </div>
        </div>
        <div
          className={`mt-8 flex-1 justify-self-center pb-3 md:mt-0 md:block md:pb-0 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <ul className="items-center justify-center space-y-8 md:flex  md:justify-end md:space-x-6 md:space-y-0 md:p-4">
            {isLoaded && isSignedIn ? (
              <li className=" hover:cursor-pointer hover:text-indigo-600">
                <Link href="/team">Team</Link>
              </li>
            ) : null}

            {viewingTeam && (
              <>
                <li className=" hover:cursor-pointer hover:text-indigo-600">
                  <Link href={`/team/${teamId}/game`}>Games</Link>
                </li>
                <li className=" hover:cursor-pointer hover:text-indigo-600">
                  <Link href={`/team/${teamId}/player`}>Roster</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        {isLoaded && isSignedIn ? (
          <div className=" hidden md:flex">
            <UserButton />
          </div>
        ) : (
          <div className="hidden  md:flex ">
            <SignInButton redirectUrl={`${getBaseUrl()}/team`}>
              <Button variant={"default"}>Sign In</Button>
            </SignInButton>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
