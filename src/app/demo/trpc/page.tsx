import { serverClient } from "@/src/app/_trpc/serverClient";
import Todo from "./todo";

async function page() {
  const todoGrab = await serverClient.getTodos();
  return (
    <div>
      <Todo />
      <div> Server Render: {JSON.stringify(todoGrab)}</div>
    </div>
  );
}

export default page;
