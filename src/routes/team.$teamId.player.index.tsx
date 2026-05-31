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

export const Route = createFileRoute("/team/$teamId/player/")({
  component: PlayerIndex,
});

function PlayerIndex() {
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
            to="/team/$teamId/game"
            params={{ teamId }}
            className="text-muted-foreground hover:text-foreground"
          >
            Games
          </Link>
        </div>
        <Link to="/team/$teamId/player/new" params={{ teamId }}>
          <Button>Add Player</Button>
        </Link>
      </div>
      {isLoaded && !isSignedIn ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in required
          </h1>
          <p className="text-muted-foreground">
            Sign in to view and manage your roster.
          </p>
          <SignInButton fallbackRedirectUrl={`/team/${teamId}/player`}>
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      ) : null}
      {isLoaded && isSignedIn ? <PlayerList teamId={teamId} /> : null}
    </main>
  );
}

function PlayerList({ teamId }: { teamId: string }) {
  const players = api.team.grabPlayers.useQuery(teamId);
  const utils = api.useUtils();
  const archivePlayer = api.player.archivePlayer.useMutation({
    onSuccess: () => {
      utils.team.grabPlayers.invalidate(teamId);
    },
  });

  if (players.isLoading) {
    return <p className="text-muted-foreground">Loading players...</p>;
  }

  if (players.error) {
    return (
      <p className="text-destructive">
        Could not load players: {players.error.message}
      </p>
    );
  }

  const activePlayers = players.data?.filter((p) => !p.archived) ?? [];
  const archivedPlayers = players.data?.filter((p) => p.archived) ?? [];

  if (!players.data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No players yet</CardTitle>
          <CardDescription>
            Add players to your roster to start tracking their stats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/team/$teamId/player/new" params={{ teamId }}>
            <Button>Add First Player</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Roster</h1>

      {activePlayers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Active Players</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activePlayers.map((player) => (
              <Card key={player.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {player.jerseyNumber}
                    </span>
                    {player.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => archivePlayer.mutate({ id: player.id })}
                    disabled={archivePlayer.isPending}
                  >
                    Archive
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {archivedPlayers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">
            Archived Players
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archivedPlayers.map((player) => (
              <Card key={player.id} className="opacity-60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                      {player.jerseyNumber}
                    </span>
                    {player.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => archivePlayer.mutate({ id: player.id })}
                    disabled={archivePlayer.isPending}
                  >
                    Restore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
