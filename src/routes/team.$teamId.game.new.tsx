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

export const Route = createFileRoute("/team/$teamId/game/new")({
  component: NewGame,
});

const createGameSchema = z.object({
  name: z.string().min(1, "Game name is required").max(255),
});

function NewGame() {
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
            <CardDescription>
              Sign in to create and manage games.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <SignInButton fallbackRedirectUrl={`/team/${teamId}/game/new`}>
              <Button>Sign In</Button>
            </SignInButton>
            <Link to="/team/$teamId/game" params={{ teamId }}>
              <Button variant="outline">Back to Games</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <NewGameForm teamId={teamId} />;
}

function NewGameForm({ teamId }: { teamId: string }) {
  const navigate = useNavigate();
  const utils = api.useUtils();
  const form = useForm({
    schema: createGameSchema,
    defaultValues: {
      name: "",
    },
  });

  const createGame = api.game.createGame.useMutation({
    onSuccess: async (game) => {
      await utils.game.grabGames.invalidate(teamId);
      toast.success(`${game?.name ?? "Game"} created`);
      await navigate({ to: "/team/$teamId/game", params: { teamId } });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col justify-center px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Game</CardTitle>
          <CardDescription>
            Add a new game to start tracking shots and statistics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-5"
              onSubmit={form.handleSubmit((values) => {
                createGame.mutate({ teamId, name: values.name });
              })}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game Name</FormLabel>
                    <FormControl>
                      <Input placeholder="vs. Rival High School" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button type="submit" disabled={createGame.isPending}>
                  {createGame.isPending ? "Creating..." : "Create Game"}
                </Button>
                <Link to="/team/$teamId/game" params={{ teamId }}>
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
