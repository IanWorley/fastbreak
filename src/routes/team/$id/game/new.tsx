import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import NewTeamFormClient from '~/components/game/NewTeamFormClient'
import Navbar from '~/components/Navbar'

export const Route = createFileRoute('/team/$id/game/new')({
  component: NewGamePage,
})

function NewGamePage() {
  return (
    <main>
      <div className="flex min-h-screen flex-col">
        <Navbar className="" />
        <div className="flex flex-grow items-center justify-center">
          <Card className="p-4 sm:w-auto">
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold">
                Create a Game
              </CardTitle>
            </CardHeader>
            <NewTeamFormClient />
          </Card>
        </div>
      </div>
    </main>
  )
}
