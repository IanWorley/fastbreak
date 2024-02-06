"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
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

type ITeamProps = {
  game: {
    id: string;
    name: string;
  };
  children: React.ReactNode;
};

const FormSchema = z.object({
  gameName: z.string(),
});

function DeleteTeamModel(props: ITeamProps) {
  const { game, children } = props;
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gameName: "",
    },
  });

  const deleteGame = api.game.deleteGame(useMutation);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (values.gameName === game.name) {
      await deleteTeam.mutateAsync();
      router.refresh(); //* I am well aware that refresh the page is not a good excuse to close the dialog but I might still want React Server Components
    } else {
      toast.warning("Input does not match team name. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} action={refreshTeamPage}>
            <DialogHeader className="">
              <h2 className="text-2xl font-semibold">Delete Team</h2>
            </DialogHeader>
            <DialogDescription>
              <p>
                If you delete this game, all data will be lost in the textbox
                below type <code className="p-2"> {game.name} </code> to confirm
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
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </DialogDescription>

            <DialogFooter className="">
              <div className="flex items-center p-4">
                <Button type="submit" className="" variant="destructive">
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
