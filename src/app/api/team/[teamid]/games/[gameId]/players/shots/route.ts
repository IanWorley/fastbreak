import { NextRequest } from "next/server";
import z from "zod";
import prisma from "@/src/lib/PrismaClient";

export async function GET(
  Req: NextRequest,
  { params }: { params: { teamid: number; gameId: number } }
) {
  const { teamid, gameId } = params;

  const teamId = z.coerce.number().safeParse(teamid);
  const gameIdAsNum = z.coerce.number().safeParse(gameId);

  if (!teamId.success || !gameIdAsNum.success) {
    return new Response(JSON.stringify({ error: "Invalid teamId or gameId" }), {
      status: 400,
    });
  }

  try {
    const shots = await prisma.shot.findMany({
      where: {
        teamId: teamId.data,
        gameId: gameIdAsNum.data,
      },
    });

    return new Response(JSON.stringify(shots), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
