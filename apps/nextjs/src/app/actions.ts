import { revalidatePath } from "next/cache";

export async function refreshGamePage(id: string) {
  revalidatePath(`/team/${id}/game`);
}

export async function refreshTeamPage() {
  revalidatePath(`/team/`);
}
