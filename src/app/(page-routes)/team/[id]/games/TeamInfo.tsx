"use client";

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

interface game {
  id: number;
  name: string;
}

function TeamInfo() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey: [`${id}/games`],
    queryFn: async () => {
      const res = await axios.get(`/api/team/${id}/games`);
      return res.data;
    },
  });

  const { mutateAsync, mutate } = useMutation({
    mutationKey: ["gamesRemove"],
    mutationFn: async (gameId: number) => {
      const res = await axios.delete(`/api/team/${id}/games/${gameId}`);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [`${id}/games`] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (isError) {
    redirect("/dashboard");
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" ">
      <div className="grid grid-cols-2">
        {data.length >= 0 &&
          data.map((game: game) => (
            <div className="bg-primary-foreground p-4 mx-32 " key={game.id}>
              <h3 className="text-2xl p-4 text-center"> {game.name}</h3>

              <div className="flex justify-center gap-4">
                <Button className="">
                  <Link href={`/team/${id}/games/${game.id}`}>View</Link>
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    mutateAsync(game.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>
      <div className="fixed z-10 p-4 right-0 bottom-0 m-4">
        <Button className="">
          <Link href={`/team/${id}/games/new `}>Add Game</Link>
        </Button>
      </div>
    </div>
  );
}

export default TeamInfo;
