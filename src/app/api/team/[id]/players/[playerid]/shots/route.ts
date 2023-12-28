import { NextRequest } from "next/server";
import z from "zod";
import prisma from "@/src/lib/PrismaClient";

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
    await prisma.shot.create({
      data: {
        teamId: teamId.data,
        gameId: 1,
        player: {
          connect: {
            id: playerid.data,
          },
        },
        x: requests.data.x,
        y: requests.data.y,
        made: requests.data.made,
      },
    });
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
