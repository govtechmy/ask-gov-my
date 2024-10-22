import { z } from "zod";

export const AgencyFormSchema = z.object({
  name_en: z.string().min(1),
  name_ms: z.string().min(1),
  acronym: z.string().min(1),
  logo_url: z.string().url().nullish(),
});
export type AgencyFormValues = z.infer<typeof AgencyFormSchema>;
