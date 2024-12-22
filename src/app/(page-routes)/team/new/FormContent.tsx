"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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

function FormContent() {
  const router = useRouter();

  const { mutateAsync, isPending } = api.team.createTeam.useMutation({
    onError: (err) => {
      console.log(err);
    },
  });

  const formSchema = z.object({
    teamName: z.string().min(3),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await mutateAsync({
      name: data.teamName,
    });
    if (res) {
      form.reset();
      router.push(`/team`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent>
          <FormField
            control={form.control}
            name="teamName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    minLength={3}
                    placeholder="Team Name"
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

export default FormContent;
