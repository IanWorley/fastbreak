"use client";

import { json } from "stream/consumers";
import { trpc } from "../../_trpc/client";

function todo() {
  const { isError, isLoading, data } = trpc.getTodos.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
}

export default todo;
