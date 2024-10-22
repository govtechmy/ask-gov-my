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
} from "@askgovmy/ui";
import { useState } from "react";

export function DeleteUserDialog({ userId }: { userId: string }) {
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
          <DialogTitle>Delete user?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure to delete user? Once deleted, it can&apos;t be retrieved.
        </DialogDescription>
        <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
          <Button
            variant="danger-primary"
            onClick={async () => {
              await deleteUser({ id: userId });
              setOpen(false);
            }}
          >
            Confirm & Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
