import { currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";

// TODO: Grab list names by team id and check if user can view games :)

export async function GET(res: NextRequest) {
  const user = currentUser();
}
