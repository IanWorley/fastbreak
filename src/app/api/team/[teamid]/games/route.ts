import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";
import { NextRequest } from "next/server";
import { z } from "zod";

// TODO: Grab list names by team id and check if user can view games :)

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const user = await currentUser();
  // zod turn string to number

  try {
    const id = z.coerce.number().parse(params.id);
    const team = await prisma.team.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    console.log(team);

    if (user!.id !== team.users_id) {
      return new Response(
        JSON.stringify({
          message: "You are not the owner of this team",
        }),
        {
          status: 401,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }

    const games = await prisma.game.findMany({
      where: {
        team: {
          id: id,
        },
      },
    });

    return new Response(JSON.stringify(games), {
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
