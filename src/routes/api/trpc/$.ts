import { auth } from "@clerk/tanstack-react-start/server";
import { createFileRoute } from "@tanstack/react-router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      OPTIONS: () => {
        const response = new Response(null, { status: 204 });
        setCorsHeaders(response);
        return response;
      },
      GET: ({ request }) => handleTRPCRequest(request),
      POST: ({ request }) => handleTRPCRequest(request),
    },
  },
});

async function handleTRPCRequest(request: Request) {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req: request,
    createContext: () => auth().then(createTRPCContext),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  setCorsHeaders(response);
  return response;
}

function setCorsHeaders(response: Response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Request-Method", "*");
  response.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  response.headers.set("Access-Control-Allow-Headers", "*");
}
