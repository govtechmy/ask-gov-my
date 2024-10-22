"use client";

import Translator from "@/components/client/translator";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  PlusIcon,
  DialogFooter,
  DialogTitle,
} from "@askgovmy/ui";
import { UserForm, UserFormFields, UserFormSubmit } from "./user-form";
import { Agency } from "@/types/types";
import { useState } from "react";
import { createUser } from "@/actions/admin/user";
import { useToast } from "@askgovmy/ui";
import { useTranslations } from "next-intl";

type AddUserDialogProps = {
  agencies: Agency[];
};

export function AddUserDialog({ agencies }: AddUserDialogProps) {
  const t = useTranslations("UserForm");
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"primary"}
          size={"sm"}
          icon={<PlusIcon className="stroke-white-forcewhite" />}
        >
          <Translator
            className="hidden md:block"
            namespace="AdminUsers.add_new"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] h-screen sm:h-fit">
        <UserForm
          className="flex flex-col"
          onSubmit={async (formValues) => {
            const result = await createUser(formValues);
            if (result.error) {
              toast({
                variant: "error",
                title: result.error,
                description: result.message,
              });
            } else {
              toast({
                variant: "success",
                title: <Translator namespace="UserForm.created" />,
              });
            }
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <Translator namespace="UserForm.add_new" tag="span" />
            </DialogTitle>
            <DialogDescription className="sr-only">
              <Translator namespace="UserForm.add_new" tag="span" />
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
