import { createFileRoute, redirect } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import Navbar from '~/components/Navbar'
import FormContent from '~/components/team/FormContent'
import { api } from '~/trpc/react'

export const Route = createFileRoute('/team/new')({
  component: NewTeamPage,
  loader: async () => {
    // We can't easily use the server-side api here without more setup,
    // so we'll just handle it in the component or use a server function.
    return {}
  },
})

function NewTeamPage() {
  // In TanStack Start, we can use the useQuery hook or a loader.
  // For now, let's just render the form.
  return (
    <div className="flex h-screen flex-col">
      <Navbar className=" " />
      <div className="flex flex-grow items-center justify-center">
        <Card className="p-4 sm:w-auto">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">
              Create a Team
            </CardTitle>
          </CardHeader>
          <FormContent />
        </Card>
      </div>
    </div>
  )
}
