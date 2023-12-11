import prisma from "@/src/lib/PrismaClient";
import { currentUser } from "@clerk/nextjs";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const { id } = params;

  const team = await prisma.team.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (team === null) {
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

  const authUser = await currentUser();
  if (authUser!.id !== team?.users_id) {
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

  return new Response(JSON.stringify([team]), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function DELETE(request: Request) {
  return new Response(
    JSON.stringify({
      message: "User deleted",
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}

export async function PUT(
  request: Request,
  { params }: { params: { id: number } }
) {
  const { id } = params;

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  const user = await response.json();

  const { name, email } = user;

  return new Response(
    JSON.stringify({
      name,
      email,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
