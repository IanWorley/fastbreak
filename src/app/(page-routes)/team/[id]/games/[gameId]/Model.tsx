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

interface DialogDemoProps {
  open: boolean;
  toggle: () => void;
}

function Model(props: DialogDemoProps) {
  const { open, toggle } = props;
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
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
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
