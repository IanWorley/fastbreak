import { revalidatePath } from "next/cache";

export async function refreshGamePage(id: number) {
  revalidatePath(`/team/${id}/game`);
}
