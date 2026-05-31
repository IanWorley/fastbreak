import { createStartHandler, defaultRenderHandler } from '@tanstack/start/server'
import { createClerkHandler } from '@clerk/tanstack-start/server'

export default createClerkHandler(
  createStartHandler({
    handler: defaultRenderHandler,
  }),
)
