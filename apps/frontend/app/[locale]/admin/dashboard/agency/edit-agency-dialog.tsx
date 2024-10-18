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
} from "@askgovmy/ui";
import {
  AgencyFormFields,
  AgencyForm,
  AgencyFormSubmit,
  AgencyFormValues,
} from "./agency-form";
import { updateAgency } from "@/actions/admin/agency";

interface EditAgencyButtonProps {
  agency: AgencyFormValues & { id: number };
}

export function EditAgencyButton({ agency }: EditAgencyButtonProps) {
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
            await updateAgency({ ...values, id: agency.id });
            setOpen(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Add new agency</DialogTitle>
            <DialogDescription className="sr-only">
              Add new agency
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
              Cancel
            </Button>
            <AgencyFormSubmit className="w-fit">Save</AgencyFormSubmit>
          </DialogFooter>
        </AgencyForm>
      </DialogContent>
    </Dialog>
  );
}
