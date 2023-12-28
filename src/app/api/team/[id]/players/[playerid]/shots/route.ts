import { NextRequest } from "next/server";
import z from "zod";
import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";

export async function GET(
  Req: NextRequest,
  { params }: { params: { id: number; playerid: number } }
) {
  const teamId = z.coerce.number().safeParse(params.id);
  const playerid = z.coerce.number().safeParse(params.playerid);

  try {
    if (!teamId.success || !playerid.success) {
      return {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ error: "Invalid teamId or playerid" }),
      };
    } else {
      return {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ teamId: teamId.data, playerid: playerid.data }),
      };
    }
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

export async function POST(
  Req: NextRequest,
  { params }: { params: { id: number; playerid: number } }
) {
  const teamId = z.coerce.number().safeParse(params.id);
  const playerid = z.coerce.number().safeParse(params.playerid);

  if (!Req.body) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: "Missing body" }),
    };
  }

  const zodSchema = z.object({
    x: z.number(),
    y: z.number(),
    made: z.boolean(),
    gameId: z.number(),
  });

  const requests = zodSchema.safeParse(Req.body);

  if (!requests.success) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: "Invalid body" }),
    };
  }

  if (!requests.data.gameId) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: "Missing gameId" }),
    };
  }

  if (!requests.data.x) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: "Missing x" }),
    };
  }

  if (!requests.data.y) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: "Missing y" }),
    };
  }

  if (!requests.data.made) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: "Missing made" }),
    };
  }

  if (!teamId.success || !playerid.success) {
    return {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ error: "Invalid teamId or playerid" }),
    };
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

    if (!team) {
      return {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ error: "Team not found" }),
      };
    }

    if (!game) {
      return {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ error: "Game not found" }),
      };
    }

    if (game.teamId !== teamId.data) {
      return {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ error: "Game not found" }),
      };
    }

    if (!player) {
      return {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ error: "Player not found" }),
      };
    }

    const user = await currentUser();

    if (!user || team.users_id !== user.id) {
      return {
        status: 401,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    await prisma.shot.create({
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
      },
    });

    return {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: "Shot added" }),
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
