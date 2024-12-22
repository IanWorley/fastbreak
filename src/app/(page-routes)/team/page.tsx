import { api } from "~/trpc/server";
import DisplayTeams from "../DisplayTeams";

export const runtime = "edge";

async function page() {
  const preFetchTeams = await api.team.grabTeams();

  return <DisplayTeams initialData={preFetchTeams} />;
}

export default page;
