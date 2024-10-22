"use client";

import { deleteUser } from "@/actions/admin/user";
import Translator from "@/components/client/translator";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  TrashIcon,
  useToast,
} from "@askgovmy/ui";
import { useState } from "react";

export function DeleteUserDialog({ userId }: { userId: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"tertiary-dropdown"} className="text-sm font-medium">
          <TrashIcon className="stroke-foreground-danger" />
          <Translator
            namespace="AdminUsers.delete"
            className="text-foreground-danger"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] rounded-lg">
        <DialogHeader>
          <DialogTitle>
            <Translator namespace="UserForm.delete" tag="span" />
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <Translator namespace="UserForm.sure_delete" tag="span" />
        </DialogDescription>
        <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
          <DialogClose asChild>
            <Button>
              <Translator namespace="UserForm.cancel" />
            </Button>
          </DialogClose>
          <Button
            variant="danger-primary"
            onClick={async () => {
              const result = await deleteUser({ id: userId });
              if (result.error) {
                toast({
                  variant: "error",
                  title: result.error,
                  description: result.message,
                });
              } else {
                toast({
                  variant: "success",
                  title: <Translator namespace="UserForm.deleted" />,
                });
              }
              setOpen(false);
            }}
          >
            <Translator namespace="UserForm.confirm_delete" tag="span" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
