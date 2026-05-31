import { SignInButton, useUser } from "@clerk/tanstack-react-start";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/ui/theme";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <main className="min-h-screen">
      <header className="fixed top-0 z-10 w-full border-b bg-background">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 md:px-8">
          <Link to="/" className="font-semibold">
            Fast Break
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoaded && isSignedIn ? (
              <Link to="/team">
                <Button>View Teams</Button>
              </Link>
            ) : (
              <SignInButton fallbackRedirectUrl="/team">
                <Button>Sign In</Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>
      <section className="flex min-h-screen flex-col items-center justify-center space-y-4 px-4 pt-16">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
          Fast Break
        </h1>
        <h2 className="scroll-m-20 text-center text-2xl tracking-tight text-gray-500 sm:text-3xl">
          A simple way to track your teams stats and progress
        </h2>
      </section>
    </main>
  );
}
