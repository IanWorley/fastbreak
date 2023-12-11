import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs";

export async function GET(req: NextRequest) {
  // Get user name from Clerk
  const { userId } = auth();

  const user = await clerkClient.users.getUser(userId!);

  let fullname = user.firstName + " " + user.lastName;

  return NextResponse.json({ fullname: fullname });
}
