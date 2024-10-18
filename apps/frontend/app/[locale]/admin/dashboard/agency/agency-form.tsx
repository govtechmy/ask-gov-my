"use client";

import {
  Input,
  FormLabel,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormSubmit,
} from "@askgovmy/ui";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PlusIcon from "@/icons/plusicon";
import { ComponentProps, PropsWithChildren, useRef, useState } from "react";
import Image from "next/image";
import Asklogo from "@/icons/asklogo";

const formSchema = z.object({
  name_en: z.string().min(1),
  name_ms: z.string().min(1),
  acronym: z.string().min(1),
  logo_url: z.string().url().nullish(),
});
type FormValues = z.infer<typeof formSchema>;
export type AgencyFormValues = FormValues;

interface AgencyFormProviderProps extends PropsWithChildren {
  className?: string;
  onSubmit: (formValues: FormValues) => void | Promise<void>;
  defaultValues?: FormValues;
}

/**
 * @example
 * ```tsx
 * <AgencyForm onSubmit={fn}>
 *   <h2>Create an agency</h2>
 *   <AgencyFormFields />
 *   <AgencyFormSubmit>Save</AgencyFormSubmit>
 * </AgencyForm>
 * ```
 */
export function AgencyForm({
  children,
  className,
  onSubmit,
  defaultValues,
}: AgencyFormProviderProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name_en: "",
      name_ms: "",
      acronym: "",
      logo_url: null,
    },
  });

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </Form>
  );
}

export function useAgencyForm() {
  const form = useFormContext<FormValues>();
  if (!form) {
    throw Error(
      "Must use `AgencyForm` or `useAgencyForm` inside an `AgencyFormProvider`"
    );
  }
  return form;
}

export function AgencyFormFields() {
  const form = useAgencyForm();

  const handleImageSelect: ImageInputProps["onSelect"] = () => {
    form.setValue("logo_url", null);
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <ImageInput onSelect={handleImageSelect} />
        <p className="text-xs text-dim-500 font-normal">
          Upload photo ideally sized not more than 200x200 pixels in PNG or JPG
          format.
        </p>
      </div>
      <FormField
        control={form.control}
        name="name_en"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Agency's name (English)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="name_ms"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Agency's name (Malay)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="acronym"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Agency's acronym</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel asChild>
            <p>Agency logo preview</p>
          </FormLabel>
          <div className="font-poppins flex gap-2.5 text-lg font-semibold items-center h-10">
            <Asklogo />
            <div className="flex">
              Ask
              <div className="text-askmygovbrand-600">
                {form.watch("acronym").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgencyFormSubmit(
  props: Omit<ComponentProps<typeof FormSubmit>, "form">
) {
  const form = useAgencyForm();
  return <FormSubmit form={form} {...props} />;
}

interface ImageInputProps {
  onSelect: (file: File) => void;
}

function ImageInput({ onSelect }: ImageInputProps) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  return (
    <div className="w-fit relative cursor-pointer">
      <button
        type="button"
        className="w-16 aspect-square rounded-full bg-washed-100 block relative border border-outline-200 overflow-hidden focus:outline-askmygovbrand-300 hover:border-askmygovbrand-300"
        onClick={() => fileInput.current?.click()}
      >
        {previewSrc && (
          <Image
            src={previewSrc}
            alt="Agency's logo"
            fill
            className="object-cover"
          />
        )}
      </button>
      <div
        className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-askmygovbrand-600 text-white grid place-items-center"
        aria-hidden="true"
      >
        <PlusIcon className="stroke-white-forcewhite" width="10" height="10" />
      </div>
      <input
        type="file"
        ref={fileInput}
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onSelect(file);
          setPreviewSrc(URL.createObjectURL(file));
        }}
        className="hidden"
      />
    </div>
  );
}
