"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type game } from "@prisma/client";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/app/_components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "~/app/_components/shadcn/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/app/_components/shadcn/ui/form";
import { Input } from "~/app/_components/shadcn/ui/input";
import { api } from "~/trpc/react";

type IGameProps = {
  game: game;
  children: React.ReactNode;
};

const FormSchema = z.object({
  gameName: z.string(),
});

function DeleteTeamModel(props: IGameProps) {
  const { game, children } = props;
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gameName: "",
    },
  });

  const { pending } = useFormStatus();
  const deleteGame = api.game.deleteGame.useMutation();

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (values.gameName === game.name) {
      await deleteGame.mutateAsync({ gameId: game.id, teamId: game.teamId });
      router.refresh(); //* I Know this is not the best way to do it but it works for now
    } else {
      toast.warning("Input does not match game name. Please try again.");
    }
  };

  return (
    <Dialog>
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
