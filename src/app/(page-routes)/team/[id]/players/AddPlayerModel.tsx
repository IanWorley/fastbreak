"use client";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Form, FormField } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface IdilogMenuAddPlayer {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string(),
  jerseyNumber: z.number().min(0),
});

export function DialogMenuAddPlayer(props: IdilogMenuAddPlayer) {
  const { open, onOpenChange } = props;
  const { id } = useParams<{ id: string }>();
  const teamId = z.coerce.number().parse(id);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      jerseyNumber: 0,
    },
  });

  const { data, isError } = useMutation({
    queryKey: ["createPlayer"],
    queryFn: async () => {
      const response = await fetch(`/api/team/${teamId}/players`, {
        method: "POST",
        body: JSON.stringify(form.getValues()),
      });

      const data = await response.json();
      return data;
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {}

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create A Player</DialogTitle>
          <DialogDescription>
            Submit the form below to create a new player.
          </DialogDescription>
        </DialogHeader>
        <Form>
          <FormField>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </FormField>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogMenuAddPlayer;
