import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";
import { z } from "zod";

export async function DELETE(
  request: Request,
  { params }: { params: { id: number; gameId: number } }
) {
  const user = await currentUser();

  try {
    const id = z.coerce.number().parse(params.id);
    const gameId = z.coerce.number().parse(params.gameId);

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

    await prisma.game.delete({
      where: {
        id: gameId,
      },
    });

    return new Response(JSON.stringify(null), {
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
