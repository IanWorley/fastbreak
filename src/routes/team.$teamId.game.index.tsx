import { SignInButton, useUser } from "@clerk/tanstack-react-start";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export const Route = createFileRoute("/team/$teamId/game/")({
  component: GameIndex,
});

function GameIndex() {
  const { isLoaded, isSignedIn } = useUser();
  const { teamId } = Route.useParams();

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/team" className="font-semibold">
            Fast Break
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            to="/team/$teamId/player"
            params={{ teamId }}
            className="text-muted-foreground hover:text-foreground"
          >
            Players
          </Link>
        </div>
        <Link to="/team/$teamId/game/new" params={{ teamId }}>
          <Button>New Game</Button>
        </Link>
      </div>
      {isLoaded && !isSignedIn ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in required
          </h1>
          <p className="text-muted-foreground">
            Sign in to view and manage your games.
          </p>
          <SignInButton fallbackRedirectUrl={`/team/${teamId}/game`}>
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      ) : null}
      {isLoaded && isSignedIn ? <GameList teamId={teamId} /> : null}
    </main>
  );
}

function GameList({ teamId }: { teamId: string }) {
  const games = api.game.grabGames.useQuery(teamId);

  if (games.isLoading) {
    return <p className="text-muted-foreground">Loading games...</p>;
  }

  if (games.error) {
    return (
      <p className="text-destructive">
        Could not load games: {games.error.message}
      </p>
    );
  }

  if (!games.data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No games yet</CardTitle>
          <CardDescription>
            Create your first game to start tracking shots and stats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/team/$teamId/game/new" params={{ teamId }}>
            <Button>Create First Game</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Games</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.data.map((game) => {
          const totalShots = game.shots?.length ?? 0;
          const madeShots = game.shots?.filter((s) => s.made).length ?? 0;
          const totalPoints =
            game.shots
              ?.filter((s) => s.made)
              .reduce((sum, s) => sum + (s.points ?? 0), 0) ?? 0;

          return (
            <Card key={game.id}>
              <CardHeader>
                <CardTitle>{game.name}</CardTitle>
                <CardDescription>
                  {totalShots > 0
                    ? `${madeShots}/${totalShots} shots • ${totalPoints} pts`
                    : "No shots recorded"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Link
                  to="/team/$teamId/game/$gameId"
                  params={{ teamId, gameId: game.id }}
                >
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </Link>
                <Link
                  to="/team/$teamId/game/$gameId/stats"
                  params={{ teamId, gameId: game.id }}
                >
                  <Button size="sm">Track Shots</Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
