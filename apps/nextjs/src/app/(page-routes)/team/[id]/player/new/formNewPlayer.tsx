"use client";

import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import { CardContent, CardFooter } from "@acme/ui/card";
import { Input } from "@acme/ui/input";

import { api } from "~/trpc/react";

function FormNewPlayer() {
  const { id } = useParams();
  const teamId = z.string().cuid2().parse(id);
  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(3),
    jerseyNumber: z.string().max(1),
  });

  const { register, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync } = api.player.addPlayer.useMutation({
    onSuccess: () => {
      router.push(`/team/${teamId}/player`);
    },
    onError: () => {
      alert("error");
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const info = z
      .object({
        name: z.string().min(3),
        jerseyNumber: z.coerce.number().positive(),
        teamId: z.string().cuid2(),
      })
      .parse({ ...data, teamId: id });
    await mutateAsync(info);
  };

  return (
    <div>
      <form className="p-4" onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="">
          <Label>Name</Label>
          <Input
            type="text"
            minLength={3}
            placeholder="player name"
            {...register("name", { required: true })}
          />
          <Label>Jersey Number</Label>
          <Input
            type="number"
            min={0}
            {...register("jerseyNumber", { required: true })}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Create</Button>
        </CardFooter>
      </form>
    </div>
  );
}

export default FormNewPlayer;
