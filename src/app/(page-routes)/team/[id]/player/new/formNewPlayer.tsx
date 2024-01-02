"use client";
import { Button } from "@/src/components/ui/button";
import { CardContent, CardFooter } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { redirect, useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

function FormNewPlayer() {
  const { id } = useParams();
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationKey: ["playerMutation"],
    mutationFn: async (data) => {
      const response = await fetch(`/api/team/${id}/player`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return data;
    },
    onSuccess: async () => {
      router.push(`/team/${id}/player`);
    },
    onError: () => {
      alert("error");
    },
  });

  const onSubmit: SubmitHandler<any> = (data) => mutateAsync(data);

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
            {...register("jersey", { required: true })}
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
