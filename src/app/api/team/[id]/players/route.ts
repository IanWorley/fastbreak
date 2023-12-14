import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/src/lib/PrismaClient";

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
