"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "~/app/_components/shadcn/ui/button";

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
