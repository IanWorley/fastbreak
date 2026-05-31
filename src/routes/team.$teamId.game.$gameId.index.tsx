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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "~/components/ui/toast";
import { api } from "~/trpc/react";

export const Route = createFileRoute("/team/$teamId/game/$gameId/")({
  component: GameDetails,
});

function GameDetails() {
  const { isLoaded, isSignedIn } = useUser();
  const { teamId, gameId } = Route.useParams();

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-8 md:px-8">
      <div className="mb-6 flex items-center gap-4">
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
      {isLoaded && !isSignedIn ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in required
          </h1>
          <p className="text-muted-foreground">
            Sign in to view game details.
          </p>
          <SignInButton fallbackRedirectUrl={`/team/${teamId}/game/${gameId}`}>
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      ) : null}
      {isLoaded && isSignedIn ? (
        <GameDetailsContent teamId={teamId} gameId={gameId} />
      ) : null}
    </main>
  );
}

function GameDetailsContent({
  teamId,
  gameId,
}: {
  teamId: string;
  gameId: string;
}) {
  const game = api.game.grabGame.useQuery({ teamId, gameId });
  const shots = api.game.grabPlayersShotsFromGame.useQuery({ teamId, gameId });
  const players = api.team.grabPlayers.useQuery(teamId);
  const utils = api.useUtils();

  const deleteGame = api.game.deleteGame.useMutation({
    onSuccess: () => {
      toast.success("Game deleted");
      utils.game.grabGames.invalidate(teamId);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (game.isLoading || shots.isLoading || players.isLoading) {
    return <p className="text-muted-foreground">Loading game details...</p>;
  }

  if (game.error) {
    return (
      <p className="text-destructive">
        Could not load game: {game.error.message}
      </p>
    );
  }

  if (!game.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Game not found</CardTitle>
          <CardDescription>
            This game may have been deleted or you don&apos;t have access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/team/$teamId/game" params={{ teamId }}>
            <Button variant="outline">Back to Games</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const totalShots = shots.data?.length ?? 0;
  const madeShots = shots.data?.filter((s) => s.made).length ?? 0;
  const missedShots = totalShots - madeShots;
  const shootingPct = totalShots > 0 ? ((madeShots / totalShots) * 100).toFixed(1) : "0.0";
  const totalPoints =
    shots.data?.filter((s) => s.made).reduce((sum, s) => sum + (s.points ?? 0), 0) ?? 0;

  const twoPointers = shots.data?.filter((s) => s.points === 2) ?? [];
  const threePointers = shots.data?.filter((s) => s.points === 3) ?? [];
  const freeThrows = shots.data?.filter((s) => s.isFreeThrow) ?? [];

  const playerMap = new Map(players.data?.map((p) => [p.id, p]) ?? []);

  const playerStats = new Map<
    string,
    { name: string; made: number; missed: number; points: number }
  >();
  for (const shot of shots.data ?? []) {
    const player = playerMap.get(shot.player_Id);
    if (!player) continue;
    const stats = playerStats.get(shot.player_Id) ?? {
      name: player.name,
      made: 0,
      missed: 0,
      points: 0,
    };
    if (shot.made) {
      stats.made += 1;
      stats.points += shot.points ?? 0;
    } else {
      stats.missed += 1;
    }
    playerStats.set(shot.player_Id, stats);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{game.data.name}</h1>
          <p className="text-muted-foreground">Game details and statistics</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/team/$teamId/game/$gameId/stats"
            params={{ teamId, gameId }}
          >
            <Button>Track Shots</Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Game</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Game</DialogTitle>
                <DialogDescription>
                  This will permanently delete this game and all associated shot
                  data. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Link to="/team/$teamId/game" params={{ teamId }}>
                  <Button
                    variant="destructive"
                    onClick={() => deleteGame.mutate({ teamId, gameId })}
                    disabled={deleteGame.isPending}
                  >
                    {deleteGame.isPending ? "Deleting..." : "Delete Game"}
                  </Button>
                </Link>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Points</CardDescription>
            <CardTitle className="text-4xl">{totalPoints}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Shooting %</CardDescription>
            <CardTitle className="text-4xl">{shootingPct}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {madeShots} made / {missedShots} missed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>2-Pointers</CardDescription>
            <CardTitle className="text-4xl">
              {twoPointers.filter((s) => s.made).length}/{twoPointers.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>3-Pointers</CardDescription>
            <CardTitle className="text-4xl">
              {threePointers.filter((s) => s.made).length}/{threePointers.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {freeThrows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Free Throws</CardTitle>
            <CardDescription>
              {freeThrows.filter((s) => s.made).length}/{freeThrows.length} (
              {freeThrows.length > 0
                ? (
                    (freeThrows.filter((s) => s.made).length / freeThrows.length) *
                    100
                  ).toFixed(1)
                : "0.0"}
              %)
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {playerStats.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Player Stats</CardTitle>
            <CardDescription>Individual shooting breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(playerStats.values())
                .sort((a, b) => b.points - a.points)
                .map((stats) => {
                  const total = stats.made + stats.missed;
                  const pct = total > 0 ? ((stats.made / total) * 100).toFixed(1) : "0.0";
                  return (
                    <div key={stats.name} className="flex items-center justify-between">
                      <span className="font-medium">{stats.name}</span>
                      <span className="text-muted-foreground">
                        {stats.points} pts • {stats.made}/{total} ({pct}%)
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {totalShots === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No shots recorded</CardTitle>
            <CardDescription>
              Start tracking shots to see game statistics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/team/$teamId/game/$gameId/stats"
              params={{ teamId, gameId }}
            >
              <Button>Track Shots</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
