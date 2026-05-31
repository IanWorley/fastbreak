import { defineConfig } from '@tanstack/start-config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  tsr: {
    appDirectory: 'src',
    routesDirectory: 'src/routes',
    generatedRouteTree: 'src/routeTree.gen.ts',
  },
  routers: {
    client: {
      entry: 'src/entry-client.tsx',
    },
    ssr: {
      entry: 'src/entry-server.tsx',
    },
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
  },
})
