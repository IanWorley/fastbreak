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
    <nav className="w-full border-b  bg-white ">
      <div className="mx-auto max-w-screen-xl items-center px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:block md:py-5">
          <div className="flex w-full justify-between ">
            {isLoaded && isSignedIn ? (
              <div className=" flex justify-end md:hidden">
                <UserButton />
              </div>
            ) : (
              <div className="flex justify-end md:hidden">
                <SignInButton redirectUrl={`${getBaseUrl()}/dashboard`}>
                  <Button variant={"default"}>Sign In</Button>
                </SignInButton>
              </div>
            )}
            <button
              className="rounded-md p-2 text-gray-700 outline-none focus:border focus:border-gray-400 md:hidden"
              onClick={handleToggle}
            >
              {isOpen ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </div>
        <div
          className={`mt-8 flex-1 justify-self-center pb-3 md:mt-0 md:block md:pb-0 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <ul className="items-center justify-center space-y-8 md:flex  md:justify-end md:space-x-6 md:space-y-0 md:p-4">
            <li className="text-gray-600 hover:cursor-pointer hover:text-indigo-600">
              <Link href="/dashboard">Dashboard</Link>
            </li>
            {viewingTeam && (
              <>
                <li className="text-gray-600 hover:cursor-pointer hover:text-indigo-600">
                  <Link href={`/team/${teamId}/game`}>Games</Link>
                </li>
                <li className="text-gray-600 hover:cursor-pointer hover:text-indigo-600">
                  <Link href={`/team/${teamId}/player`}>Roster</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        {isLoaded && isSignedIn ? (
          <div className=" hidden justify-start md:flex">
            <UserButton />
          </div>
        ) : (
          <div className="hidden justify-start md:flex ">
            <SignInButton redirectUrl={`${getBaseUrl()}/dashboard`}>
              <Button variant={"default"}>Sign In</Button>
            </SignInButton>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
