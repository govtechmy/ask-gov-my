"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
  GearIcon,
  useToast,
} from "@askgovmy/ui";
import { AgencyFormFields, AgencyForm, AgencyFormSubmit } from "./agency-form";
import { updateAgency } from "@/actions/admin/agency";
import Translator from "@/components/client/translator";
import { AgencyFormValues } from "@/actions/admin/agency.schema";

interface EditAgencyDialogProps {
  agency: AgencyFormValues & { id: number };
}

export function EditAgencyDialog({ agency }: EditAgencyDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-8 h-8 p-1.5 hover:cursor-pointer"
          variant={"secondary"}
          size={"sm"}
          icon={<GearIcon className="w-4 h-4 stroke-black-700" />}
        />
      </DialogTrigger>
      <DialogContent className="max-w-[600px] h-screen sm:h-fit">
        <AgencyForm
          className="flex flex-col"
          defaultValues={agency}
          onSubmit={async (values) => {
            const result = await updateAgency({ ...values, id: agency.id });
            if (result.error) {
              toast({
                variant: "error",
                title: result.error,
                description: result.message,
              });
            } else {
              toast({
                variant: "success",
                title: <Translator namespace="AgencyForm.edited" />,
              });
            }
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <Translator namespace="AgencyForm.setting" />
            </DialogTitle>
            <DialogDescription className="sr-only">
              <Translator namespace="AgencyForm.setting" tag="span" />
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 my-5">
            <AgencyFormFields />
          </div>
          <DialogFooter className="flex flex-row gap-2 justify-end">
            <Button
              className="w-fit"
              type="button"
              onClick={() => setOpen(false)}
            >
              <Translator namespace="AgencyForm.cancel" />
            </Button>
            <AgencyFormSubmit className="w-fit">
              <Translator namespace="AgencyForm.save" />
            </AgencyFormSubmit>
          </DialogFooter>
        </AgencyForm>
      </DialogContent>
    </Dialog>
  );
}
