import { createFileRoute } from '@tanstack/react-router'
import { api } from '~/trpc/react'
import DisplayTeams from '~/components/team/DisplayTeams'

export const Route = createFileRoute('/team/')({
  component: TeamPage,
  loader: async ({ context }) => {
    // In a real app, you might want to prefetch here
    return {}
  },
})

function TeamPage() {
  // We can still use the trpc hook inside the component
  // The initialData will be handled by the component itself if we pass it,
  // but for now let's just let it fetch on the client or use the loader.
  return <DisplayTeams initialData={[]} />
}
