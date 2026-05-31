import { createFileRoute } from '@tanstack/react-router'
import { SignInButton } from '@clerk/tanstack-start'
import { useUser } from '@clerk/tanstack-start'
import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import Navbar from '~/components/Navbar'
import { getBaseUrl } from '~/lib/utils'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { user } = useUser()

  return (
    <div className="overflow-y-auto">
      <main className="pt-10">
        <Navbar className="fixed top-0" />
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 px-4">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
            Fast Break
          </h1>
          <h2 className="scroll-m-20 text-center text-2xl tracking-tight text-gray-500 sm:text-3xl">
            A simple way to track your teams stats and progress
          </h2>
          {user ? (
            <Link to="/team">
              <Button> View Teams </Button>
            </Link>
          ) : (
            <SignInButton signUpFallbackRedirectUrl={`${getBaseUrl()}/team`}>
              <Button variant={"default"}>Sign In</Button>
            </SignInButton>
          )}
        </div>
      </main>
    </div>
  )
}
