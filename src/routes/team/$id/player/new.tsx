import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import Navbar from '~/components/Navbar'
import FormNewPlayer from '~/components/player/formNewPlayer'

export const Route = createFileRoute('/team/$id/player/new')({
  component: NewPlayerPage,
})

function NewPlayerPage() {
  const { id } = Route.useParams()
  return (
    <main>
      <div className="flex h-screen flex-col">
        <Navbar className="" viewingTeam={true} teamId={id} />
        <div className="flex flex-grow items-center justify-center">
          <Card className="p-4 sm:w-auto">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold">
                Add a Player
              </CardTitle>
            </CardHeader>
            <FormNewPlayer />
          </Card>
        </div>
      </div>
    </main>
  )
}
