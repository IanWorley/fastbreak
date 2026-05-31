import { auth } from "@clerk/tanstack-react-start/server";
import { cache } from "react";

import { createCaller, createTRPCContext } from "~/server/api/index";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
  return auth().then(createTRPCContext);
});

export const api = createCaller(createContext);
