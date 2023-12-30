import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/PrismaClient";

export async function POST(
  Req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const teamId = z.coerce.number().parse(params.id);

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

    const jersey = z.coerce.number().safeParse(data.jersey);

    if (!jersey.success) {
      return new Response(
        JSON.stringify({
          message: "Jersey must be a number",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }

    const player = await prisma.player.create({
      data: {
        name: data.name,
        jersey: jersey.data,
        team: {
          connect: {
            id: teamId,
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

export async function GET(
  Req: NextRequest,
  { params }: { params: { teamid: number } }
) {
  try {
    const teamId = z.coerce.number().safeParse(params.teamid);

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
