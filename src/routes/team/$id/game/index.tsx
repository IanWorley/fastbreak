import { createFileRoute } from '@tanstack/react-router'
import DisplayListGames from '~/components/game/DisplayListGames'

export const Route = createFileRoute('/team/$id/game/')({
  component: GameListPage,
})

function GameListPage() {
  const { id } = Route.useParams()
  return <DisplayListGames id={id} initialData={[]} />
}
