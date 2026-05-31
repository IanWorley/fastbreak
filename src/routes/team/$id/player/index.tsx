import { createFileRoute } from '@tanstack/react-router'
import Navbar from '~/components/Navbar'
import PlayerClient from '~/components/player/PlayerClient'

export const Route = createFileRoute('/team/$id/player/')({
  component: PlayerPage,
})

function PlayerPage() {
  const { id } = Route.useParams()
  return (
    <main className="overflow-y-scroll">
      <Navbar teamId={id} viewingTeam={true} className="sticky top-0" />
      <div className="flex flex-col justify-center p-8">
        <PlayerClient />
      </div>
    </main>
  )
}
