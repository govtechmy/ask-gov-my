"use client";

import React, { useState } from "react";
import Translator from "@/components/client/translator";
import {
  Button,
  PlusIcon,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@askgovmy/ui";
import { AgencyFormFields, AgencyForm, AgencyFormSubmit } from "./agency-form";
import { createAgency } from "@/actions/admin/agency";

export function AddAgencyButton() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="primary"
          size="sm"
          icon={<PlusIcon className="stroke-white-forcewhite" />}
        >
          <Translator namespace="AdminAgencies.add_new" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] h-screen sm:h-fit">
        <AgencyForm
          className="flex flex-col"
          onSubmit={async (values) => {
            await createAgency(values);
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
