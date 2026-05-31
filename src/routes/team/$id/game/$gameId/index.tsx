import { createFileRoute, notFound } from '@tanstack/react-router'
import Navbar from '~/components/Navbar'
import GameClient from '~/components/game/GameClient'

export const Route = createFileRoute('/team/$id/game/$gameId/')({
  component: GamePage,
})

function GamePage() {
  const { id, gameId } = Route.useParams()
  // In a real app, we'd fetch the game name here or in a loader
  return (
    <main className="">
      <Navbar teamId={id} viewingTeam={true} className="fixed top-0" />
      <h1 className="p-10 pt-20 text-center text-4xl font-extrabold">
        Game Details
      </h1>
      <GameClient />
    </main>
  )
}
