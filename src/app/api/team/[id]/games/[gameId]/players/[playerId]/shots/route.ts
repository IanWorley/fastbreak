import { NextRequest } from "next/server";
import z from "zod";
import prisma from "@/src/lib/PrismaClient";

export async function GET(
  Req: NextRequest,
  { params }: { params: { teamid: number; gameid: number; playerid: number } }
) {
  const { teamid, gameid, playerid } = params;

  // Validate and parse the IDs...

  const teamId = z.coerce.number().safeParse(teamid);
  const gameId = z.coerce.number().safeParse(gameid);
  const playerId = z.coerce.number().safeParse(playerid);

  if (!teamId.success || !gameId.success || !playerId.success) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: "Invalid teamId, gameId, or playerId" }),
    };
  }

  try {
    const shots = await prisma.shot.findMany({
      where: {
        teamId: teamid,
        gameId: gameid,
        playerId: playerid,
      },
    });

    return {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(shots),
    };
  } catch (error) {
    return {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
}
