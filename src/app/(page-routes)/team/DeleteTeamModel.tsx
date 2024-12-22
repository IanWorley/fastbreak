"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/app/_components/ui/form";
import { Input } from "~/app/_components/ui/input";

import { api } from "~/trpc/react";

interface ITeamProps {
  team: {
    id: string;
    name: string;
  };
  children: React.ReactNode;
}

const FormSchema = z.object({
  teamName: z.string(),
});

function DeleteTeamModel(props: ITeamProps) {
  const { team, children } = props;
  const [dialog, setOpenDialog] = useState(false);
  const utils = api.useUtils();
  const { pending } = useFormStatus();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      teamName: "",
    },
  });

  const deleteTeam = api.team.deleteTeam.useMutation({
    onSuccess: () => {
      toast.success("Team Deleted Successfully");
      void utils.team.grabTeams.invalidate();
    },

    onSettled: () => {
      setOpenDialog(false);
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (values.teamName === team.name) {
      await deleteTeam.mutateAsync(team.id);
    } else {
      toast.warning("Input does not match team name. Please try again.");
    }
  };

  return (
    <Dialog
      open={dialog}
      onOpenChange={(o) => {
        setOpenDialog(o);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="">
              <h2 className="text-2xl font-semibold">Delete Team</h2>
            </DialogHeader>
            <DialogDescription>
              <p>
                If you delete this team, all data will be lost in the textbox
                below type <code className="p-2"> {team.name} </code> to confirm
              </p>
              <FormField
                name="teamName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel htmlFor="teamName">Team Name</FormLabel>
                    <FormControl>
                      <Input
                        className="mb-4"
                        placeholder={team.name}
                        {...field}
                        disabled={deleteTeam.isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </DialogDescription>

            <DialogFooter className="">
              <div className="flex items-center justify-center p-4 md:justify-end">
                <Button
                  type="submit"
                  className=""
                  variant="destructive"
                  aria-disabled={pending}
                >
                  Delete
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteTeamModel;
