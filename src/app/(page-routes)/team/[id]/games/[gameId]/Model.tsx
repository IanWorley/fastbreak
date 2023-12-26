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
import { Form } from "@/src/components/ui/form";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/src/components/ui/select";
import { SelectContent, SelectTrigger } from "@radix-ui/react-select";
import { usePlayerForApp } from "@/src/state/PlayerForApp";

interface DialogDemoProps {
  open: boolean;
  toggle: () => void;
}

function Model(props: DialogDemoProps) {
  const { open, toggle } = props;
  const { players } = usePlayerForApp((state) => state);
  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register Shot</DialogTitle>
          <DialogDescription>Mark the shot as made or missed</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Player
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="flex ">
            <Label htmlFor="username" className="text-right">
              Select
            </Label>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-primary-foreground">
                  <SelectLabel>Fruits</SelectLabel>
                  {players
                    .filter((player) => player.isPlaying === true)
                    .map((player) => (
                      <SelectItem key={player.id} value={player.name}>
                        {player.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
      </DialogContent>
    </Dialog>
  );
}

export default Model;
