import { NextRequest } from "next/server";
import z from "zod";
import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";

export async function GET(
  Req: NextRequest,
  { params }: { params: { teamid: number; playerid: number } }
) {
  const teamId = z.coerce.number().safeParse(params.teamid);
  const playerid = z.coerce.number().safeParse(params.playerid);

  try {
    if (!teamId.success || !playerid.success) {
      return new Response(JSON.stringify({ error: "Invalid teamId or  hi" }), {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      });
    }
    return new Response(
      JSON.stringify({ teamId: teamId.data, playerid: playerid.data })
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}

export async function POST(
  Req: NextRequest,
  { params }: { params: { teamid: number; playerid: number } }
) {
  const teamId = z.coerce.number().safeParse(params.teamid);
  const playerid = z.coerce.number().safeParse(params.playerid);

  if (!Req.body) {
    return new Response(JSON.stringify({ error: "Missing body" }), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const zodSchema = z.object({
    x: z.number().min(0).max(499),
    y: z.number().min(0).max(499),
    points: z.number().min(1).max(3),
    made: z.boolean(),
    gameId: z.number(),
  });

  const jsonBody = await Req.json();

  const requests = zodSchema.safeParse(jsonBody);

  if (!requests.success) {
    return new Response(JSON.stringify({ error: "Invalid body" }), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  console.log(requests.data);

  if (!teamId.success || !playerid.success) {
    return new Response("Invalid teamId or playerid", { status: 400 });
  }

  try {
    const player = await prisma.player.findUniqueOrThrow({
      where: {
        id: playerid.data,
      },
    });

    const team = await prisma.team.findUniqueOrThrow({
      where: {
        id: teamId.data,
      },
    });

    const game = await prisma.game.findUniqueOrThrow({
      where: {
        id: requests.data.gameId,
      },
    });

    const shot = await prisma.shot.create({
      data: {
        team: {
          connect: {
            id: teamId.data,
          },
        },

        game: {
          connect: {
            id: requests.data.gameId,
          },
        },

        player: {
          connect: {
            id: player!.id,
          },
        },
        xPoint: requests.data.x,
        yPoint: requests.data.y,
        made: requests.data.made,
        points: requests.data.points,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const player_total = await prisma.player.update({
      where: {
        id: player!.id,
      },
      data: {
        totalPoints: {
          increment: requests.data.points,
        },
      },
    });

    return new Response(JSON.stringify(shot), {
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
