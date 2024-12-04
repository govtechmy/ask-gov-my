"use client";

import Google from "@/icons/google";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { checkUserEmailExists } from "@/actions/auth";
import { requestLoginCodeAction } from "@/actions/auth";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSubmit,
  Input,
  Button,
} from "@askgovmy/ui";
import WordTranslate from "../../../../components/common/WordTranslate";

export function LoginForm() {
  const t = useTranslations("Adminlogin");
  const authSchema = z.object({
    email: z
      .string({
        required_error: t("required"),
        invalid_type_error: t("required"),
      })
      .email({ message: t("invalid_email") }),
  });
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
  });

  const handleSignIn = async () => {
    try {
      const { email } = form.getValues();
      const emailExists = await checkUserEmailExists(email);
      if (emailExists) {
        await requestLoginCodeAction(email);
      } else {
        form.setError("email", { message: t("error_no_account") });
      }
    } catch {
      form.setError("email", { message: t("error_code_fail") });
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/admin/dashboard" });
  };

  return (
    <Form {...form}>
      <div className="max-w-[400px] flex flex-col items-center justify-center container gap-8 px-4.5 lg:px-0">
        <div className="text-center w-full flex flex-col gap-4">
          <h6 className="text-2xl font-semibold">{t("h1")}</h6>
          <WordTranslate
            translate="Adminlogin"
            keyword={"para1"}
            className="text-base text-black-700"
          />
        </div>

        <div className="w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("email")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full space-y-4">
          <FormSubmit
            className="w-full"
            form={form}
            onClick={form.handleSubmit(handleSignIn)}
          >
            {t("1stbutton")}
          </FormSubmit>
          <p className="text-center text-dim-500 text-sm">{t("or")}</p>
          <Button
            className="w-full"
            variant={"secondary"}
            onClick={handleGoogleSignIn}
          >
            <Google /> {t("2ndbutton")}
          </Button>
        </div>
      </div>
    </Form>
  );
}
