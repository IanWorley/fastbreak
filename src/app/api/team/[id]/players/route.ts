import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/PrismaClient";

export async function POST(
  Req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const teamId = z.coerce.number().safeParse(params.id);

    console.log(teamId);

    if (!teamId.success) {
      return new Response(
        JSON.stringify({
          message: "Team not found",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }

    if (!Req.body) {
      return new Response(
        JSON.stringify({
          message: "Body is required",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }

    const data = await Req.json();

    if (!data.name) {
      return new Response(
        JSON.stringify({
          message: "Name is required",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }

    if (typeof data.name !== "string") {
      return new Response(
        JSON.stringify({
          message: "Name must be a string",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }

    const team = await prisma.team.findUniqueOrThrow({
      where: {
        id: teamId.data,
      },
    });

    const player = await prisma.player.create({
      data: {
        name: data.name,
        jersey: data.jersey,
        team: {
          connect: {
            id: teamId.data,
          },
        },
      },
    });

    return new Response(JSON.stringify(player), {
      status: 201,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Team not found",
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

export async function GET(
  Req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const teamId = z.coerce.number().safeParse(params.id);

    if (!teamId.success) {
      return new Response(
        JSON.stringify({
          message: "Team not found",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }

    const team = await prisma.team.findUniqueOrThrow({
      where: {
        id: teamId.data,
      },
      include: {
        players: true,
      },
    });

    return new Response(JSON.stringify(team.players), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Team not found",
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
