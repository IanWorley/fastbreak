import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware

// if /api/trpc/* is public write a functio with isPublic to use regex to match the routes and only /apt/trpc/* will be public
const trpcRoute = createRouteMatcher("/api/trpc/:path*");

const isPublic = createRouteMatcher("/");

export default clerkMiddleware((auth, req) => {
  if (isPublic(req) || trpcRoute(req)) {
    return NextResponse.next();
  }

  if (!auth().userId && !isPublic(req)) {
    auth().protect();
  }

  if (auth().userId && !isPublic(req)) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

// export default authMiddleware({
// make a regular expression to match all routes /api/trpc/*
// using Path-to-RegExp

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
