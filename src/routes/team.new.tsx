import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/team/new")({
  component: NewTeamPlaceholder,
});

function NewTeamPlaceholder() {
  return (
    <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col justify-center gap-4 px-4">
      <h1 className="text-3xl font-bold tracking-tight">Create Team</h1>
      <p className="text-muted-foreground">
        This route is scaffolded for the TanStack Start migration. The existing
        Next.js form will move here in a later slice.
      </p>
      <Link to="/team">
        <Button variant="outline">Back to Teams</Button>
      </Link>
    </main>
  );
}
