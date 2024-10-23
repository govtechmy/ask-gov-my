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
import { AgencyImageInput } from "./agency-image-input";
import Translator from "@/components/client/translator";
import {
  AgencyFormSchema,
  AgencyFormValues,
} from "@/actions/admin/agency.schema";
import { z } from "zod";
import { getUploadLogoDetails } from "@/actions/admin/agency";
import { useTranslations } from "next-intl";

interface AgencyFormProviderProps extends PropsWithChildren {
  className?: string;
  onSubmit: (formValues: AgencyFormValues) => void | Promise<void>;
  defaultValues?: AgencyFormValues;
}

const ExtendedAgencyFormSchema = AgencyFormSchema.extend({
  // An additional field to store logo that will be uploaded on submit
  logo_file: z.instanceof(File).nullable(),
});

async function uploadLogo(
  file: File,
  agencyAcronym: string
): Promise<{ success: false } | { success: true; logoUrl: string }> {
  try {
    const { uploadUrl, downloadUrl } = await getUploadLogoDetails({
      fileType: file.type,
      agencyAcronym,
    });

    const res = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": "inline",
      },
    });

    if (!res.ok) {
      return { success: false };
    }
    return { success: true, logoUrl: downloadUrl };
  } catch (error) {
    return { success: false };
  }
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
  const t = useTranslations("AgencyForm");
  const form = useForm<z.infer<typeof ExtendedAgencyFormSchema>>({
    resolver: zodResolver(ExtendedAgencyFormSchema),
    defaultValues: defaultValues || {
      name_en: "",
      name_ms: "",
      acronym: "",
      logo_url: null,
      logo_file: null,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const { logo_file, ...rest } = values;

    // Upload the logo on submit
    if (logo_file) {
      const uploadResult = await uploadLogo(logo_file, values.acronym);
      if (!uploadResult.success) {
        form.setError("logo_url", {
          type: "custom",
          message: t("error_upload"),
        });
        return;
      }
      rest.logo_url = uploadResult.logoUrl;
    }

    await onSubmit(rest);
  });

  return (
    <Form {...form}>
      <form className={className} onSubmit={handleSubmit}>
        {children}
      </form>
    </Form>
  );
}

export function useAgencyForm() {
  const form = useFormContext<z.infer<typeof ExtendedAgencyFormSchema>>();
  if (!form) {
    throw Error(
      "Must use `AgencyForm` or `useAgencyForm` inside an `AgencyFormProvider`"
    );
  }
  return form;
}

export function AgencyFormFields() {
  const form = useAgencyForm();

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
                <AgencyImageInput name={field.name} disabled={field.disabled} />
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
  const { isDirty, isSubmitting } = form.formState;
  const disabled = isSubmitting || !isDirty;
  return <FormSubmit form={form} disabled={disabled} {...props} />;
}
