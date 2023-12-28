import { NextRequest } from "next/server";
import z from "zod";

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
