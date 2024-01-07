"use client";

import { trpc } from "@/src/app/_trpc/client";
import { Button } from "@/src/components/ui/button";
import { CardContent, CardFooter } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useParams } from "next/navigation";

function NewTeamFormClient() {
  const { id } = useParams();

  return (
    <form className="" action={onSubmit}>
      <CardContent>
        <Input
          type="text"
          minLength={3}
          name="gameName"
          placeholder="Game name"
        />
        <input type="number" hidden name="teamId" value={id} />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="" type="submit">
          Create
        </Button>
      </CardFooter>
    </form>
  );
}

export default NewTeamFormClient;
