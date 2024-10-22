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
import { ComponentProps, PropsWithChildren } from "react";
import Asklogo from "@/icons/asklogo";
import { AgencyImageInput, AgencyImageInputProps } from "./agency-image-input";
import { useTranslations } from "next-intl";
import Translator from "@/components/client/translator";
import {
  AgencyFormSchema,
  AgencyFormValues,
} from "@/actions/admin/agency.schema";

const MAX_IMAGE_HEIGHT = 200;
const MAX_IMAGE_WIDTH = 200;

interface AgencyFormProviderProps extends PropsWithChildren {
  className?: string;
  onSubmit: (formValues: AgencyFormValues) => void | Promise<void>;
  defaultValues?: AgencyFormValues;
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
  const form = useForm<AgencyFormValues>({
    resolver: zodResolver(AgencyFormSchema),
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
  const form = useFormContext<AgencyFormValues>();
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
              <FormLabel className="sr-only">
                <Translator namespace="AgencyForm.agency_acronym" />
              </FormLabel>
              <FormControl>
                <AgencyImageInput
                  onSelectImage={handleImageSelect}
                  name={field.name}
                  disabled={field.disabled}
                />
              </FormControl>
              {!fieldState.error && (
                <FormLabel className="text-xs text-dim-500 font-normal">
                  <Translator namespace="AgencyForm.agency_logo_helptext" />
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
            <FormLabel>
              <Translator namespace="AgencyForm.agency_name_english" />
            </FormLabel>
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
            <FormLabel>
              <Translator namespace="AgencyForm.agency_name_malay" />
            </FormLabel>
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
              <FormLabel>
                <Translator namespace="AgencyForm.agency_acronym" />
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel asChild>
            <Translator namespace="AgencyForm.agency_logo_preview" />
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
