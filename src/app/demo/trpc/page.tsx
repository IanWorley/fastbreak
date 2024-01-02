import { serverClient } from "@/src/app/_trpc/serverClient";
import Todo from "./todo";

async function page() {
  const todoGrab = await serverClient.getTodos();
  const grabTeams = await serverClient.TeamRouter.grabTeam();

  return (
    <div>
      <Todo />
      <div> Server Render: {JSON.stringify(todoGrab)}</div>
      <div> Server Render: {JSON.stringify(grabTeams)}</div>
    </div>
  );
}

export default page;
