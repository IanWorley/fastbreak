"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { CardContent, CardFooter } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { api } from "~/trpc/react";

function NewTeamFormClient() {
  const { id } = useParams({ strict: false });

  const navigate = useNavigate();

  const teamId = z.string().cuid2().parse(id);

  const games = api.game.grabGames.useQuery(teamId);

  const { mutateAsync, isPending } = api.game.createGame.useMutation({
    onError: (err) => {
      console.log(err);
    },
  });

  const formSchema = z.object({
    gameName: z.string().min(3),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await mutateAsync({
      name: data.gameName,
      teamId: teamId,
    });
    if (res) {
      form.reset();
      void games.refetch();
      void navigate({ to: `/team/$id/game/$gameId`, params: { id: teamId, gameId: res.id } });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FormField
            control={form.control}
            name="gameName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Game Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    minLength={3}
                    placeholder="name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            Create
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

export default NewTeamFormClient;
