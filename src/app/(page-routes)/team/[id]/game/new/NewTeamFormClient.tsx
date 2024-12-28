"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/app/_components/ui/button";
import { CardContent, CardFooter } from "~/app/_components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";

import { api } from "~/trpc/react";

function NewTeamFormClient() {
  const { id } = useParams();

  const router = useRouter();

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
      router.push(`/team/${teamId}/game/${res.id}`);
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
