import { z } from "zod";

export const UserFormSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(["staff", "super_admin"]),
    agency: z.number().nullable(),
  })
  .transform((arg, ctx) => {
    // Ensure staff users must have an agency
    if (arg.role === "staff" && arg.agency === null) {
      ctx.addIssue({
        code: "custom",
        message: "Agency is required",
        path: ["agency"],
      });
    }

    // Ensure super_admin's `agency` field is null
    if (arg.role === "super_admin") {
      arg.agency = null;
    }

    return arg;
  });

export type UserFormValues = z.infer<typeof UserFormSchema>;
