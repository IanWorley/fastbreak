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
import { Input } from "@/src/components/ui/input";
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

interface DialogDemoProps {
  open: boolean;
  toggle: () => void;
}

function Model(props: DialogDemoProps) {
  const form = useForm();
  const { open, toggle } = props;
  const { players } = usePlayerForApp((state) => state);
  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register Shot</DialogTitle>
          <DialogDescription>Mark the shot as made or missed</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="flex">
            <div className="flex-row">
              <FormField
                control={form.control}
                name="player_id"
                render={({ field }) => (
                  <>
                    <FormItem>
                      <Label htmlFor="player_select">Player</Label>
                      <Select name="player_select">
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
                    <FormItem>
                      <FormLabel>Shot Type</FormLabel>
                      <FormControl {...field}>
                        <RadioGroup>
                          <FormControl>
                            <FormLabel>Made</FormLabel>
                            <RadioGroupItem value="Made"></RadioGroupItem>
                          </FormControl>
                          <FormControl>
                            <FormLabel>Missed</FormLabel>
                            <RadioGroupItem value="Missed"></RadioGroupItem>
                          </FormControl>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  </>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                toggle();
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default Model;
