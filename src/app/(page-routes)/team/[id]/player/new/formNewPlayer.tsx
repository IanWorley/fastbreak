"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/app/_components/ui/button";
import { CardContent, CardFooter } from "~/app/_components/ui/card";
import { Input } from "~/app/_components/ui/input";

import { api } from "~/trpc/react";

function FormNewPlayer() {
  const { id } = useParams();
  const teamId = z.string().cuid2().parse(id);
  const router = useRouter();

  const players = api.team.grabPlayers.useQuery(teamId);

  const formSchema = z.object({
    name: z.string().min(3),
    jerseyNumber: z.string().max(1),
  });

  const { register, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutateAsync } = api.player.addPlayer.useMutation({
    onSuccess: async () => {
      await players.refetch();
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
