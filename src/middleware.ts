import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "./lib/PrismaClient";
import { z } from "zod";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware

export default authMiddleware({
  publicRoutes: ["/"],

  async afterAuth(auth, req, evt) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // // Redirect logged in users to organization selection page if they are not active in an organization
    // if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/") {
    //   const orgSelection = new URL("/", req.url);
    //   return NextResponse.redirect(orgSelection);

    // }
    // If the user is logged in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      const teamId = req.nextUrl.pathname.split("/")[2];

      const vaildateTeamId = z.coerce.number().safeParse(teamId);

      if (
        vaildateTeamId.success &&
        vaildateTeamId.data &&
        req.nextUrl.pathname.split("/")[1] === "team"
      ) {
        const team = await prisma.team.findUnique({
          where: {
            id: vaildateTeamId.data,
          },
        });

        if (team === null || team === undefined) {
          return NextResponse.redirect("http://localhost:3000/404");
        }

        if (team?.users_id === auth.userId) {
          return NextResponse.next();
        } else {
          return NextResponse.redirect("http://localhost:3000/dashboard");
        }
      }

      return NextResponse.next();
    }
    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
