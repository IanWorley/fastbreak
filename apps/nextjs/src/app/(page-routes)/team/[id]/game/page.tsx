import { api } from "~/trpc/server";
import DisplayListGames from "./DisplayListGames";

export const runtime = "edge";

interface Props {
  params: { id: string };
}

async function Page(props: Props) {
  const { params } = props;
  const initialData = await api.game.grabGames(params.id);

  return <DisplayListGames id={props.params.id} initialData={initialData} />;
}

export default Page;
