"use client";
import { Button } from "~/app/_components/shadcn/ui/button";
import { CardContent, CardFooter } from "~/app/_components/shadcn/ui/card";
import { Input } from "~/app/_components/shadcn/ui/input";
import { useMutation } from "@tanstack/react-query";
import { redirect, useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";

function FormNewPlayer() {
  const { id } = useParams();
  const teamId = z.coerce.number().parse(id);
  const router = useRouter();

  // const { mutateAsync } = useMutation({
  //   mutationKey: ["playerMutation"],
  //   mutationFn: async (data) => {
  //     const response = await fetch(`/api/team/${id}/player`, {
  //       method: "POST",
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     return data;
  //   },
  //   onSuccess: async () => {
  //     router.push(`/team/${id}/player`);
  //   },
  //   onError: () => {
  //     alert("error");
  //   },
  // });

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
        teamId: z.string(),
      })
      .parse({ ...data, teamId: id });
    await mutateAsync(info);
  };

  return (
    <div>
      <form className=" p-4 " onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="">
          <Input
            type="text"
            minLength={3}
            placeholder="player name"
            {...register("name", { required: true })}
          />
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
