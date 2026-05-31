import { createAPIFileRoute } from '@tanstack/start/api'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '~/server/api/root'
import { createTRPCContext } from '~/server/api/trpc'

export const Route = createAPIFileRoute('/api/trpc/$')({
  GET: ({ request }) => {
    return fetchRequestHandler({
      endpoint: '/api/trpc',
      req: request,
      router: appRouter,
      createContext: createTRPCContext,
    })
  },
  POST: ({ request }) => {
    return fetchRequestHandler({
      endpoint: '/api/trpc',
      req: request,
      router: appRouter,
      createContext: createTRPCContext,
    })
  },
})
