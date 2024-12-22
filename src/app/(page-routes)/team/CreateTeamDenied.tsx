"use client";

import { Button } from "~/app/_components/ui/button";
import { toast } from "~/app/_components/ui/toast";

function CreateTeamDenied() {
  return (
    <Button
      variant={"default"}
      onClick={() => {
        toast.error("You can only have one team at the moment 😞");
      }}
    >
      Create Team
    </Button>
  );
}

export default CreateTeamDenied;
