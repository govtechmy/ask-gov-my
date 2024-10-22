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
  useToast,
} from "@askgovmy/ui";
import { UserForm, UserFormFields, UserFormSubmit } from "./user-form";
import { Agency } from "@/types/types";
import { useState } from "react";
import { updateUser } from "@/actions/admin/user";
import { UserFormValues } from "@/actions/admin/user.schema";

type EditUserDialogProps = {
  user: UserFormValues & { id: string };
  agencies: Agency[];
};

export function EditUserDialog({ user, agencies }: EditUserDialogProps) {
  const { toast } = useToast();
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
            const result = await updateUser({ ...formValues, id: user.id });
            if (result.error) {
              toast({
                variant: "error",
                title: result.error,
                description: result.message,
              });
            } else {
              toast({
                variant: "success",
                title: <Translator namespace="UserForm.edited" />,
              });
            }
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
