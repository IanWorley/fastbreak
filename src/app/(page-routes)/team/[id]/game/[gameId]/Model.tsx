"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectContent, SelectTrigger } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "~/app/_components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/shadcn/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/app/_components/shadcn/ui/form";
import { Label } from "~/app/_components/shadcn/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "~/app/_components/shadcn/ui/radio-group";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "~/app/_components/shadcn/ui/select";
import { usePlayerForApp } from "~/store/PlayerForApp";
import { api } from "~/trpc/react";

interface DialogDemoProps {
  open: boolean;
  toggle: () => void;
  x: number;
  y: number;
  gameId: string;
  teamid: string;
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

  const utils = api.useUtils();

  const { mutateAsync } = api.player.addShots.useMutation({
    // onSuccess: () => {
    //   form.reset();
    //   void utils.team.grabPlayers.invalidate();
    //   void utils.game.grabPlayersShotsFromGame.invalidate();
    // },

    onMutate: async () => {
      await utils.game.grabPlayersShotsFromGame.cancel();
      const previousShots = utils.game.grabPlayersShotsFromGame.getData();
      utils.game.grabPlayersShotsFromGame.setData(
        { gameId: gameId, teamId: teamid },
        (oldData) => {
          return [
            ...(oldData ?? []),
            {
              id: Math.random().toString(),
              playerId: form.getValues("player_id"),
              made:
                form.getValues("shot_attempt").toLowerCase() ===
                "Made".toLowerCase()
                  ? true
                  : false,
              xPoint: x,
              yPoint: y,
              points: z.coerce.number().parse(form.getValues("points")),
              isFreeThrow: form.getValues("points") === "1" ? true : false,
              createdAt: new Date(),
              teamId: teamid,
              gameId: gameId,
              updatedAt: new Date(),
            },
          ] as {
            // Co pilot is saving typeSafty
            id: string;
            teamId: string;
            gameId: string;
            playerId: string;
            xPoint: number;
            yPoint: number;
            made: boolean;
            createdAt: Date;
            updatedAt: Date;
            points: number;
            isFreeThrow: boolean;
          }[];
        },
      );
      toggle();
      return { previousShots };
    },

    onSettled: () => {
      void utils.game.grabPlayersShotsFromGame.invalidate();
    },

    onError: (error, shot, context) => {
      toast.error("An error occurred");
      console.error(error);
      if (context) {
        utils.game.grabPlayersShotsFromGame.setData(
          { gameId: gameId, teamId: teamid },
          context.previousShots,
        );
      }
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.points === "1") {
      await mutateAsync({
        teamId: teamid,
        gameId: gameId,
        playerId: data.player_id,
        made:
          data.shot_attempt.toLowerCase() === "Made".toLowerCase()
            ? true
            : false,
        x: x,
        y: y,
        points: 2,
        isFreeThrow: true,
      });
    } else {
      await mutateAsync({
        teamId: teamid,
        gameId: gameId,
        playerId: data.player_id,
        made:
          data.shot_attempt.toLowerCase() === "Made".toLowerCase()
            ? true
            : false,
        x: x,
        y: y,
        points: z.coerce.number().parse(data.points),
      });
    }

    form.reset();
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
                          defaultValue={field.value}
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
