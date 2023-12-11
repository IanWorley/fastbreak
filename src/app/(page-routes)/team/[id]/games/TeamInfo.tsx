"use client";

import { useQuery } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

function TeamInfo() {
  const { id } = useParams();
  const { isLoading, isError, data } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const res = await axios.get(`/api/team/${id}`);
      console.log(res.data);
      return res.data;
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
          data.map((game) => (
            <div className="" key={game.id}>
              <p> {game.id}</p>
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
