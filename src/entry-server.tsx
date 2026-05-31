import { createStartHandler, defaultRenderHandler } from '@tanstack/start/server'
import { createClerkHandler } from '@clerk/tanstack-start/server'

// @ts-ignore
export default createClerkHandler(createStartHandler)(defaultRenderHandler)
