import { api } from "~/trpc/server";
import DisplayListGames from "./DisplayListGames";

export const runtime = "edge";

interface Props {
  params: Promise<{ id: string }>;
}

async function Page(props: Props) {
  const params = await props.params;

  const { id } = params;

  const initialData = await api.game.grabGames(id);

  return <DisplayListGames id={id} initialData={initialData} />;
}

export default Page;
