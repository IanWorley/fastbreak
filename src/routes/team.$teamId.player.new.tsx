import { SignInButton, useUser } from "@clerk/tanstack-react-start";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/toast";
import { api } from "~/trpc/react";

export const Route = createFileRoute("/team/$teamId/player/new")({
  component: NewPlayer,
});

const addPlayerSchema = z.object({
  name: z.string().min(1, "Player name is required").max(255),
  jerseyNumber: z.coerce
    .number()
    .int()
    .positive("Jersey number must be positive"),
});

function NewPlayer() {
  const { isLoaded, isSignedIn } = useUser();
  const { teamId } = Route.useParams();

  if (!isLoaded) {
    return (
      <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col justify-center px-4">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col justify-center px-4">
        <Card>
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>Sign in to add players to your team.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <SignInButton fallbackRedirectUrl={`/team/${teamId}/player/new`}>
              <Button>Sign In</Button>
            </SignInButton>
            <Link to="/team/$teamId/player" params={{ teamId }}>
              <Button variant="outline">Back to Roster</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <NewPlayerForm teamId={teamId} />;
}

function NewPlayerForm({ teamId }: { teamId: string }) {
  const navigate = useNavigate();
  const utils = api.useUtils();
  const form = useForm({
    schema: addPlayerSchema,
    defaultValues: {
      name: "",
      jerseyNumber: 0,
    },
  });

  const addPlayer = api.player.addPlayer.useMutation({
    onSuccess: async (player) => {
      await utils.team.grabPlayers.invalidate(teamId);
      toast.success(`${player?.name ?? "Player"} added to roster`);
      await navigate({ to: "/team/$teamId/player", params: { teamId } });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col justify-center px-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Player</CardTitle>
          <CardDescription>Add a new player to your roster.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-5"
              onSubmit={form.handleSubmit((values) => {
                addPlayer.mutate({
                  teamId,
                  name: values.name,
                  jerseyNumber: values.jerseyNumber,
                });
              })}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jerseyNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jersey Number</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="23" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button type="submit" disabled={addPlayer.isPending}>
                  {addPlayer.isPending ? "Adding..." : "Add Player"}
                </Button>
                <Link to="/team/$teamId/player" params={{ teamId }}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
