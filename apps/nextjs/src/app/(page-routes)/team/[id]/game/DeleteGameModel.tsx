"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { gameType } from "@acme/db";
import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@acme/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";

import { api } from "~/trpc/react";

interface IGameProps {
  game: gameType;
  children: React.ReactNode;
}

const FormSchema = z.object({
  gameName: z.string(),
});

function DeleteTeamModel(props: IGameProps) {
  const { game, children } = props;
  const utils = api.useUtils();
  const [openDialog, setOpenDialog] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gameName: "",
    },
  });

  const deleteGame = api.game.deleteGame.useMutation({
    onSuccess: () => {
      toast.success("Game Deleted Successfully");
      void utils.game.grabGames.invalidate();
    },
    onSettled: () => {
      setOpenDialog(false);
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (values.gameName === game.name) {
      await deleteGame.mutateAsync({
        gameId: game.id,
        teamId: game.teamId,
      });
    } else {
      toast.warning("Input does not match game name. Please try again.");
    }
  };

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(o) => {
        setOpenDialog(o);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="">
              <h2 className="text-2xl font-semibold">Delete Game</h2>
            </DialogHeader>
            <DialogDescription>
              <p>
                If you delete this game, all data will be lost in the textbox
                below type <code className="p-2"> {game.name} </code> to confirm
              </p>
              <FormField
                name="gameName"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel htmlFor="teamName">Team Name</FormLabel>
                    <FormControl>
                      <Input
                        className="mb-4"
                        placeholder={game.name}
                        {...field}
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
                  disabled={deleteGame.isPending}
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
