"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import type { shotType } from "@acme/db";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/app/_components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/app/_components/ui/radio-group";

import { api } from "~/trpc/react";

interface DialogDemoProps {
  open: boolean;
  toggle: () => void;
  x: number;
  y: number;
  gameId: string;
  teamid: string;
  quarter: number;
  setPlayerShooting: (playerId: string) => void;
  playerShooting: string;
}

const FormSchema = z.object({
  shot_attempt: z.string(),
  points: z.string(),
});

function Model(props: DialogDemoProps) {
  const { open, toggle, x, y, teamid, gameId, quarter, playerShooting } = props;

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
        { gameId: gameId, teamId: teamid, quarter: quarter },
        (oldData: shotType[] | undefined) => {
          return [
            ...(oldData ?? []),
            {
              id: Math.random().toString(),
              player_Id: playerShooting.toString(),
              quarter: quarter,
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
              team_Id: teamid,
              game_Id: gameId,
              updatedAt: new Date(),
            },
          ];
        },
      );
      utils.game.grabPlayersShotsFromGame.setData(
        { gameId: gameId, teamId: teamid, quarter: undefined },
        (oldData: shotType[] | undefined) => {
          return [
            ...(oldData ?? []),
            {
              id: Math.random().toString(),
              player_Id: playerShooting.toString(),
              quarter: quarter,
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
              team_Id: teamid,
              game_Id: gameId,
              updatedAt: new Date(),
            },
          ];
        },
      );

      toggle();
      form.reset();

      return { previousShots };
    },

    onSettled: () => {
      void utils.game.grabPlayersShotsFromGame.invalidate();
      void utils.game.grabGames.refetch(teamid);
    },

    onError: (error, shot, context) => {
      toast.error("An error occurred");
      console.error(error);
      if (context) {
        utils.game.grabPlayersShotsFromGame.setData(
          {
            gameId: gameId,
            teamId: teamid,
            quarter: quarter,
          },
          context.previousShots,
        );
        utils.game.grabPlayersShotsFromGame.setData(
          { gameId: gameId, teamId: teamid, quarter: undefined },
          context.previousShots,
        );
      }
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (z.string().parse(playerShooting.toString()) === "") {
      toast.error("Please select a player");
      return;
    }
    console.log(data.points);

    if (data.points === "1") {
      await mutateAsync({
        teamId: teamid,
        gameId: gameId,
        playerId: playerShooting.toString(),
        made:
          data.shot_attempt.toLowerCase() === "Made".toLowerCase()
            ? true
            : false,
        x: x,
        y: y,
        points: 2,
        isFreeThrow: true,
        quarter: quarter,
      });
    } else {
      await mutateAsync({
        teamId: teamid,
        gameId: gameId,
        playerId: playerShooting.toString(),
        made:
          data.shot_attempt.toLowerCase() === "Made".toLowerCase()
            ? true
            : false,
        x: x,
        y: y,
        points: z.coerce.number().parse(data.points),
        quarter: quarter,
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
