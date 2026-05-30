import { SignInButton, useUser } from "@clerk/tanstack-react-start";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/app/_components/ui/card";
import { api } from "~/trpc/react";

export const Route = createFileRoute("/team/")({
  component: TeamIndex,
});

function TeamIndex() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link to="/" className="font-semibold">
          Fast Break
        </Link>
        <Link to="/team/new">
          <Button>Create Team</Button>
        </Link>
      </div>
      {isLoaded && !isSignedIn ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in required
          </h1>
          <p className="text-muted-foreground">
            Sign in to view and manage your teams.
          </p>
          <SignInButton fallbackRedirectUrl="/team">
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      ) : null}
      {isLoaded && isSignedIn ? <TeamList /> : null}
    </main>
  );
}

function TeamList() {
  const teams = api.team.grabTeams.useQuery();

  if (teams.isLoading) {
    return <p className="text-muted-foreground">Loading teams...</p>;
  }

  if (teams.error) {
    return (
      <p className="text-destructive">
        Could not load teams: {teams.error.message}
      </p>
    );
  }

  if (!teams.data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No teams yet</CardTitle>
          <CardDescription>
            Create your first team to start tracking games and players.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {teams.data.map((team) => (
        <Card key={team.id}>
          <CardHeader>
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>Team dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/team/$teamId/game" params={{ teamId: team.id }}>
              <Button variant="outline">View Games</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
