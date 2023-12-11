import { SignInButton, UserButton, auth, currentUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";

interface NavbarProps {
  className?: string;
}

async function Navbar({ className }: NavbarProps) {
  const user = await currentUser();
  return (
    <div
      className={
        className +
        "   top-0 w-full h-17 border-b-2  z-4 items-center  flex justify-end bg-background  "
      }
    >
      {user ? (
        <div className="p-4 flex-row flex items-center gap-10">
          <Link href="/dashboard" className=" ">
            Dashboard
          </Link>
          <UserButton afterSignOutUrl="http://localhost:3000/" />
        </div>
      ) : (
        <div className="p-4  ">
          <SignInButton>
            <Button> Sign In </Button>
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
