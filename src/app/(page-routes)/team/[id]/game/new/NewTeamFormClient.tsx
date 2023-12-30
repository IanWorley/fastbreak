"use client";

import { Button } from "@/src/components/ui/button";
import { CardContent, CardFooter } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { useParams } from "next/navigation";

interface INewFormClientsProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

function NewTeamFormClient(props: INewFormClientsProps) {
  const { id } = useParams();
  const { onSubmit } = props;
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
