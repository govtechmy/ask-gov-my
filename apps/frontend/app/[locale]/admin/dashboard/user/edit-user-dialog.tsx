"use client";

import Translator from "@/components/client/translator";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  PencilIcon,
} from "@askgovmy/ui";
import {
  UserForm,
  UserFormFields,
  UserFormSubmit,
  UserFormValues,
} from "./user-form";
import { Agency } from "@/types/types";
import { useState } from "react";
import { updateUser } from "@/actions/admin/user";

type EditUserDialogProps = {
  user: UserFormValues & { id: string };
  agencies: Agency[];
};

export function EditUserDialog({ user, agencies }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"tertiary-dropdown"} className="text-sm font-medium">
          <PencilIcon className="stroke-black-900" />
          <Translator namespace="AdminUsers.edit" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] h-screen sm:h-fit">
        <UserForm
          className="flex flex-col"
          defaultValues={user}
          onSubmit={async (formValues) => {
            await updateUser({ ...formValues, id: user.id });
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <Translator namespace="UserForm.setting" tag="span" />
            </DialogTitle>
            <DialogDescription className="sr-only">
              <Translator namespace="UserForm.setting" tag="span" />
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 my-5">
            <UserFormFields agencies={agencies} />
          </div>
          <DialogFooter className="flex flex-row gap-2 justify-end">
            <Button type="button" onClick={() => setOpen(false)}>
              <Translator namespace="UserForm.cancel" />
            </Button>
            <UserFormSubmit>
              <Translator namespace="UserForm.save" />
            </UserFormSubmit>
          </DialogFooter>
        </UserForm>
      </DialogContent>
    </Dialog>
  );
}
