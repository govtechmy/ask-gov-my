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

export function AddAgencyDialog() {
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
            <DialogTitle>
              <Translator namespace="AgencyForm.add_new" />
            </DialogTitle>
            <DialogDescription className="sr-only">
              <Translator namespace="AgencyForm.add_new" />
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
