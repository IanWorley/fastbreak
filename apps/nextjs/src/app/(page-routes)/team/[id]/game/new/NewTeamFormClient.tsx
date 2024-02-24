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

import { refreshGamePage } from "~/app/actions";
import { api } from "~/trpc/react";

function NewTeamFormClient() {
  const { id } = useParams();

  const router = useRouter();

  const teamId = z.string().cuid2().parse(id);

  const { mutateAsync } = api.game.createGame.useMutation({
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
      router.push(`/team/${teamId}/game/${res.id}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        action={() => {
          void refreshGamePage(teamId);
        }}
      >
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
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Create</Button>
        </CardFooter>
      </form>
    </Form>
  );
}

export default NewTeamFormClient;
