"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { FaBars, FaXmark } from "react-icons/fa6";

import { Button } from "@acme/ui/button";
import { ThemeToggle } from "@acme/ui/theme";

import { getBaseUrl } from "~/lib/utils";

interface NavbarProps {
  className?: string;
  viewingTeam?: boolean; // Add the 'viewingTeam' prop to the interface definition
  teamId?: string;
}

function Navbar({ className, viewingTeam, teamId }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { isLoaded, isSignedIn } = useUser();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`w-full border-b bg-background ${className} `}>
      <div className="mx-auto max-w-screen-xl items-center px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:block md:py-5">
          <div className="flex w-full justify-between ">
            {isLoaded && isSignedIn ? (
              <div className=" flex justify-end md:hidden">
                <UserButton />
              </div>
            ) : (
              <div className="flex justify-end md:hidden">
                <SignInButton fallbackRedirectUrl={`${getBaseUrl()}/team`}>
                  <Button variant={"default"}>Sign In</Button>
                </SignInButton>
              </div>
            )}
            <ThemeToggle />
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
            <SignInButton fallbackRedirectUrl={`${getBaseUrl()}/team`}>
              <Button variant={"default"}>Sign In</Button>
            </SignInButton>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
