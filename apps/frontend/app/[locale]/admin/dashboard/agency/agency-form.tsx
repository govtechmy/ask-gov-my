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
import { ComponentProps, PropsWithChildren } from "react";
import Asklogo from "@/icons/asklogo";
import { AgencyImageInput, AgencyImageInputProps } from "./agency-image-input";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  name_en: z.string().min(1),
  name_ms: z.string().min(1),
  acronym: z.string().min(1),
  logo_url: z.string().url().nullish(),
});
type FormValues = z.infer<typeof formSchema>;
export type AgencyFormValues = FormValues;

const MAX_IMAGE_HEIGHT = 200;
const MAX_IMAGE_WIDTH = 200;

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
  const t = useTranslations("AgencyForm");
  const form = useAgencyForm();

  const handleImageSelect: AgencyImageInputProps["onSelectImage"] = (
    _file,
    { width, height }
  ) => {
    if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
      form.setError("logo_url", {
        type: "custom",
        message: t("error_image_exceed_size"),
      });
      return;
    }
    // TODO: Upload image to S3
    form.setValue("logo_url", null);
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <FormField
          control={form.control}
          name="logo_url"
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              <FormLabel className="sr-only">{t("agency_logo")}</FormLabel>
              <FormControl>
                <AgencyImageInput
                  onSelectImage={handleImageSelect}
                  defaultSrc={form.getValues("logo_url")}
                  name={field.name}
                  disabled={field.disabled}
                />
              </FormControl>
              {!fieldState.error && (
                <FormLabel className="text-xs text-dim-500 font-normal">
                  {t("agency_logo_helptext")}
                </FormLabel>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="name_en"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>{t("agency_name_english")}</FormLabel>
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
            <FormLabel>{t("agency_name_malay")}</FormLabel>
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
              <FormLabel>{t("agency_acronym")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel asChild>
            <p>{t("agency_logo_preview")}</p>
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
