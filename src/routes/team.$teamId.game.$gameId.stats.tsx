import { SignInButton, useUser } from "@clerk/tanstack-react-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { toast } from "~/components/ui/toast";
import { useShotsForGame } from "~/hooks/ShotHooks";
import { usePlayerForApp } from "~/store/PlayerForApp";
import { api } from "~/trpc/react";

export const Route = createFileRoute("/team/$teamId/game/$gameId/stats")({
  component: ShotTracking,
});

function ShotTracking() {
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
        <span className="text-muted-foreground">/</span>
        <Link
          to="/team/$teamId/game/$gameId"
          params={{ teamId, gameId }}
          className="text-muted-foreground hover:text-foreground"
        >
          Details
        </Link>
      </div>
      {isLoaded && !isSignedIn ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Sign in required
          </h1>
          <p className="text-muted-foreground">Sign in to track shots.</p>
          <SignInButton
            fallbackRedirectUrl={`/team/${teamId}/game/${gameId}/stats`}
          >
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      ) : null}
      {isLoaded && isSignedIn ? (
        <ShotTrackingContent teamId={teamId} gameId={gameId} />
      ) : null}
    </main>
  );
}

function ShotTrackingContent({
  teamId,
  gameId,
}: {
  teamId: string;
  gameId: string;
}) {
  const game = api.game.grabGame.useQuery({ teamId, gameId });
  const playersQuery = api.team.grabPlayers.useQuery(teamId);
  const { players, addPlayers } = usePlayerForApp();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [quarter, setQuarter] = useState(1);
  const [shotPending, setShotPending] = useState<{
    x: number;
    y: number;
    points: number;
  } | null>(null);

  const shots = useShotsForGame(gameId, teamId, undefined);
  const utils = api.useUtils();

  useEffect(() => {
    if (playersQuery.data) {
      addPlayers(playersQuery.data.filter((p) => !p.archived));
    }
  }, [playersQuery.data, addPlayers]);

  const addShot = api.player.addShots.useMutation({
    onSuccess: () => {
      utils.game.grabPlayersShotsFromGame.invalidate({ teamId, gameId });
      setShotPending(null);
    },
    onError: (error) => {
      toast.error(error.message);
      setShotPending(null);
    },
  });

  if (game.isLoading || playersQuery.isLoading) {
    return <p className="text-muted-foreground">Loading...</p>;
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
        </CardHeader>
        <CardContent>
          <Link to="/team/$teamId/game" params={{ teamId }}>
            <Button variant="outline">Back to Games</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const activePlayers = players.filter((p) => p.isPlaying);
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId);

  const handleCourtClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!selectedPlayerId) {
      toast.error("Select a player first");
      return;
    }

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const is3Pointer = isThreePointer(x, y);
    setShotPending({ x, y, points: is3Pointer ? 3 : 2 });
  };

  const recordShot = (made: boolean, isFreeThrow = false) => {
    if (!selectedPlayerId) return;

    const x = isFreeThrow ? 50 : shotPending?.x ?? 50;
    const y = isFreeThrow ? 85 : shotPending?.y ?? 50;
    const points = isFreeThrow ? 1 : shotPending?.points ?? 2;

    addShot.mutate({
      playerId: selectedPlayerId,
      teamId,
      gameId,
      x,
      y,
      made,
      points,
      quarter,
      isFreeThrow,
    });

    if (!isFreeThrow) {
      setShotPending(null);
    }
  };

  const currentQuarterShots = shots.filter((s) => s.quarter === quarter);
  const totalPoints = currentQuarterShots
    .filter((s) => s.made)
    .reduce((sum, s) => sum + (s.points ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{game.data.name}</h1>
          <p className="text-muted-foreground">
            Q{quarter} • {totalPoints} points
          </p>
        </div>
        <Link to="/team/$teamId/game/$gameId" params={{ teamId, gameId }}>
          <Button variant="outline">View Stats</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <BasketballCourt
                onClick={handleCourtClick}
                shots={currentQuarterShots}
                pendingShot={shotPending}
              />
            </CardContent>
          </Card>

          {shotPending && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {shotPending.points === 3 ? "3-Point Shot" : "2-Point Shot"}
                </CardTitle>
                <CardDescription>
                  {selectedPlayer?.name} • Q{quarter}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  onClick={() => recordShot(true)}
                  disabled={addShot.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Made
                </Button>
                <Button
                  onClick={() => recordShot(false)}
                  disabled={addShot.isPending}
                  variant="destructive"
                  className="flex-1"
                >
                  Missed
                </Button>
                <Button
                  onClick={() => setShotPending(null)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quarter</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={quarter.toString()}
                onValueChange={(v) => setQuarter(Number.parseInt(v, 10))}
                className="flex flex-wrap gap-2"
              >
                {[1, 2, 3, 4, 5].map((q) => (
                  <div key={q} className="flex items-center space-x-2">
                    <RadioGroupItem value={q.toString()} id={`q${q}`} />
                    <Label htmlFor={`q${q}`}>{q === 5 ? "OT" : `Q${q}`}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Players</CardTitle>
              <CardDescription>Select player to record shot</CardDescription>
            </CardHeader>
            <CardContent>
              {activePlayers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No active players. Add players to your roster first.
                </p>
              ) : (
                <div className="space-y-2">
                  {activePlayers.map((player) => (
                    <button
                      type="button"
                      key={player.id}
                      onClick={() => setSelectedPlayerId(player.id)}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${
                        selectedPlayerId === player.id
                          ? "border-primary bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {player.jerseyNumber}
                        </span>
                        <span className="font-medium">{player.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedPlayerId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Free Throw</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button
                  onClick={() => recordShot(true, true)}
                  disabled={addShot.isPending}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  Made
                </Button>
                <Button
                  onClick={() => recordShot(false, true)}
                  disabled={addShot.isPending}
                  variant="destructive"
                  className="flex-1"
                  size="sm"
                >
                  Missed
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function isThreePointer(x: number, y: number): boolean {
  const courtCenterX = 50;
  const basketY = 90;
  const threePointRadius = 35;
  const cornerThreeX = 15;

  if (x < cornerThreeX || x > 100 - cornerThreeX) {
    return y < 75;
  }

  const dx = x - courtCenterX;
  const dy = y - basketY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance > threePointRadius;
}

interface Shot {
  id: string;
  xPoint: number;
  yPoint: number;
  made: boolean;
  points: number | null;
}

function BasketballCourt({
  onClick,
  shots,
  pendingShot,
}: {
  onClick: (e: React.MouseEvent<SVGSVGElement>) => void;
  shots: Shot[];
  pendingShot: { x: number; y: number; points: number } | null;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full cursor-crosshair rounded-lg bg-amber-100"
      onClick={onClick}
    >
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="none"
        stroke="#8B4513"
        strokeWidth="0.5"
      />

      <rect
        x="19"
        y="70"
        width="62"
        height="30"
        fill="none"
        stroke="#8B4513"
        strokeWidth="0.3"
      />

      <rect
        x="31"
        y="80"
        width="38"
        height="20"
        fill="none"
        stroke="#8B4513"
        strokeWidth="0.3"
      />

      <circle
        cx="50"
        cy="85"
        r="10"
        fill="none"
        stroke="#8B4513"
        strokeWidth="0.3"
      />

      <circle cx="50" cy="92" r="1.5" fill="#FF6600" stroke="#8B4513" strokeWidth="0.2" />

      <rect x="44" y="92" width="12" height="8" fill="none" stroke="#8B4513" strokeWidth="0.3" />

      <path
        d="M 6 70 L 6 100"
        fill="none"
        stroke="#8B4513"
        strokeWidth="0.3"
      />
      <path
        d="M 94 70 L 94 100"
        fill="none"
        stroke="#8B4513"
        strokeWidth="0.3"
      />
      <path
        d="M 6 70 Q 50 40 94 70"
        fill="none"
        stroke="#8B4513"
        strokeWidth="0.3"
      />

      <line x1="0" y1="50" x2="100" y2="50" stroke="#8B4513" strokeWidth="0.3" />
      <circle cx="50" cy="50" r="10" fill="none" stroke="#8B4513" strokeWidth="0.3" />

      {shots.map((shot) => (
        <circle
          key={shot.id}
          cx={shot.xPoint}
          cy={shot.yPoint}
          r="2"
          fill={shot.made ? "#22c55e" : "#ef4444"}
          stroke="white"
          strokeWidth="0.3"
          opacity="0.8"
        />
      ))}

      {pendingShot && (
        <circle
          cx={pendingShot.x}
          cy={pendingShot.y}
          r="2.5"
          fill="#3b82f6"
          stroke="white"
          strokeWidth="0.5"
        >
          <animate
            attributeName="r"
            values="2.5;3.5;2.5"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
}
