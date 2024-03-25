"use client";

import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import { CardContent, CardFooter } from "@acme/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";

import { api } from "~/trpc/react";

function NewTeamFormClient() {
  const { id } = useParams();

  const router = useRouter();

  const teamId = z.string().cuid2().parse(id);

  const utils = api.useUtils();

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
      void utils.game.grabGames.refetch(teamId);
      form.reset();
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
