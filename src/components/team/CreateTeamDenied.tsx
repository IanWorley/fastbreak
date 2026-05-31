"use client";

import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/toast";

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
