"use client";
import { Button } from "@/src/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/components/ui/form";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/src/components/ui/select";
import { SelectContent, SelectTrigger } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";
import { usePlayerForApp } from "@/src/store/PlayerForApp";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { trpc } from "@/src/app/_trpc/client";

interface DialogDemoProps {
  open: boolean;
  toggle: () => void;
  x: number;
  y: number;
  gameId: string;
  teamid: string;
}

interface Shot {
  shot_attempt: boolean;
  player_id: number;
  x: number;
  y: number;
  points: string;
}

const FormSchema = z.object({
  player_id: z.string(),
  shot_attempt: z.string(),
  points: z.string(),
});

function Model(props: DialogDemoProps) {
  const { open, toggle, x, y, teamid, gameId } = props;
  const { players } = usePlayerForApp((state) => state);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const queryClient = useQueryClient();

  const { mutateAsync } = trpc.PlayerRouter.addShots.useMutation({
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["shots"] });
    },
    onError: (error) => {
      console.log(error);
      toast("Error", { type: "error" });
    },
  });

  // const { mutateAsync } = useMutation({
  //   mutationFn: async (data: Shot) => {
  //     const res = await fetch(
  //       `/api/team/${teamid}/players/${data.player_id}/shots`,
  //       {
  //         method: "POST",
  //         body: JSON.stringify({
  //           made: data.shot_attempt,
  //           x: data.x,
  //           y: data.y,
  //           gameId: z.coerce.number().parse(gameId),
  //           points: z.coerce.number().parse(data.points),
  //         }),
  //       }
  //     );
  //     if (!res.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return res.json();
  //   },
  //   onSuccess: () => {
  //     form.reset();
  //     queryClient.invalidateQueries({ queryKey: ["players"] });
  //     queryClient.invalidateQueries({ queryKey: ["shots"] });
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //     toast("Error", { type: "error" });
  //   },
  // });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const player_id = z.coerce.number().parse(data.player_id);
    let shot = null as unknown as Shot;

    if (data.shot_attempt.toLowerCase() === "made") {
      shot = { shot_attempt: true, player_id, x, y, points: data.points };
    } else if (data.shot_attempt === "Missed") {
      shot = { shot_attempt: false, player_id, x, y, points: data.points };
    } else {
      throw new Error("Invalid shot attempt");
    }

    mutateAsync({
      teamId: teamid,
      gameId: gameId,
      playerId: data.player_id,
      made: shot.shot_attempt,
      x: x,
      y: y,
      points: data.points,
    });

    toggle();
  }

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register Shot</DialogTitle>
          <DialogDescription>Mark the shot as made or missed</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex">
              <div className="flex-row">
                <FormField
                  control={form.control}
                  name="player_id"
                  render={({ field }) => (
                    <FormItem className="p-4">
                      <Label htmlFor="player_select">Player</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        name="player_select"
                      >
                        <FormControl {...field}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a Player" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup className="bg-primary-foreground">
                            <SelectLabel>Players </SelectLabel>
                            {players
                              .filter((player) => player.isPlaying === true)
                              .map((player) => (
                                <SelectItem
                                  key={player.id}
                                  value={player.id.toString()}
                                >
                                  {player.name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  name="shot_attempt"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shot Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="Made"></RadioGroupItem>
                            </FormControl>
                            <FormLabel>Made</FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value="Missed"></RadioGroupItem>
                            </FormControl>
                            <FormLabel>Missed</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onChange={field.onChange}
                          defaultValue={field.value as string}
                          className="flex items-center"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value={"1"}></RadioGroupItem>
                            </FormControl>
                            <FormLabel>Free throw</FormLabel>
                          </FormItem>

                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value={"2"}></RadioGroupItem>
                            </FormControl>
                            <FormLabel>Two pointer</FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem value={"3"}></RadioGroupItem>
                            </FormControl>
                            <FormLabel>Three pointer</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default Model;
