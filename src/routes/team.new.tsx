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

export const Route = createFileRoute("/team/new")({
  component: NewTeam,
});

const createTeamSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(255),
});

function NewTeam() {
  const { isLoaded, isSignedIn } = useUser();

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
              Sign in to create and manage your teams.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <SignInButton fallbackRedirectUrl="/team/new">
              <Button>Sign In</Button>
            </SignInButton>
            <Link to="/team">
              <Button variant="outline">Back to Teams</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <NewTeamForm />;
}

function NewTeamForm() {
  const navigate = useNavigate();
  const utils = api.useUtils();
  const form = useForm({
    schema: createTeamSchema,
    defaultValues: {
      name: "",
    },
  });

  const createTeam = api.team.createTeam.useMutation({
    onSuccess: async (team) => {
      await utils.team.grabTeams.invalidate();
      toast.success(`${team?.name ?? "Team"} created`);
      await navigate({ to: "/team" });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col justify-center px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Team</CardTitle>
          <CardDescription>
            Add a team before tracking rosters, games, and shots.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-5"
              onSubmit={form.handleSubmit((values) => {
                createTeam.mutate(values);
              })}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="organization"
                        placeholder="Varsity Panthers"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-3">
                <Button type="submit" disabled={createTeam.isPending}>
                  {createTeam.isPending ? "Creating..." : "Create Team"}
                </Button>
                <Link to="/team">
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
