import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/PrismaClient";

export async function GET(
  Req: NextRequest,
  { params }: { params: { id: number; playerid: number } }
) {
  const { id, playerid } = params;

  const teamId = z.coerce.number().safeParse(id);
  const playerId = z.coerce.number().safeParse(playerid);

  if (!teamId.success) {
    return new Response(
      JSON.stringify({
        message: "Team id must be a number",
      }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  if (!playerId.success) {
    return new Response(
      JSON.stringify({
        message: "Player id must be a number",
      }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  try {
    const team = await prisma.player.findUniqueOrThrow({
      where: {
        id: playerId.data,
        teamId: teamId.data,
      },
    });

    return new Response(JSON.stringify(team), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error.message,
      }),
      {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
}

export async function DELETE(
  Req: NextRequest,
  { params }: { params: { id: number; playerid: number } }
) {
  const { id, playerid } = params;
  const teamid = z.coerce.number().safeParse(id);
  const playerId = z.coerce.number().safeParse(playerid);

  if (!teamid.success) {
    return new Response(
      JSON.stringify({
        message: "Team id must be a number",
      }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  if (!playerId.success) {
    return new Response(
      JSON.stringify({
        message: "Player id must be a number",
      }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  try {
    const team = await prisma.player.delete({
      where: {
        id: playerId.data,
      },
    });

    return new Response(null, {
      status: 201,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error.message,
      }),
      {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
}
