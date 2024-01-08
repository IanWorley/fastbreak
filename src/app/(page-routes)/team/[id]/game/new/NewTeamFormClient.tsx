"use client";

import { trpc } from "@/src/app/_trpc/client";
import { Button } from "@/src/components/ui/button";
import { CardContent, CardFooter } from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

function NewTeamFormClient() {
  const { id } = useParams();

  const router = useRouter();

  const teamId = z.coerce.number().parse(id);

  // TODO FIND A WAY TO change route after mutation
  const { mutateAsync } = trpc.GameRouter.createGame.useMutation({
    onSuccess: () => {
      router.push(`/team/${teamId}/game`);
    },
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
          <Button type="submit">Create</Button>
        </CardFooter>
      </form>
    </Form>
  );
}

export default NewTeamFormClient;
