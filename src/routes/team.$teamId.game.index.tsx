import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/team/$teamId/game/")({
  component: GameListPlaceholder,
});

function GameListPlaceholder() {
  const { teamId } = Route.useParams();

  return (
    <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col justify-center gap-4 px-4">
      <h1 className="text-3xl font-bold tracking-tight">Games</h1>
      <p className="text-muted-foreground">
        Team {teamId} is ready for the TanStack Start game list migration.
      </p>
      <Link to="/team">
        <Button variant="outline">Back to Teams</Button>
      </Link>
    </main>
  );
}
