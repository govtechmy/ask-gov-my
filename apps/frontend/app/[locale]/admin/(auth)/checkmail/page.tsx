"use client";
import { Link } from "@/lib/i18n";
import { useTranslations } from "next-intl";
import {
  Button,
  buttonVariants,
  MailLogoIcon,
  ArrowLeftIcon,
  MailIcon,
} from "@askgovmy/ui";
import { useState, useEffect } from "react";
import { cn } from "@askgovmy/utils";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormSubmit,
} from "@askgovmy/ui";
import { resendLoginCodeAction } from "@/actions/auth";
import { route } from "@/lib/routes";

export const dynamic = "force-dynamic";

const CheckmailPage = ({ params }: { params: { locale: string } }) => {
  const t = useTranslations("Checkmail");
  const router = useRouter();
  const searchParams = useSearchParams();
  const codeValidation = z.object({
    code: z
      .string({ required_error: "required", invalid_type_error: "required" })
      .length(6, "invalid_length"),
  });
  const form = useForm<z.infer<typeof codeValidation>>({
    resolver: zodResolver(codeValidation),
  });

  const INITIAL_COUNTDOWN = 60;
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const isDisabled = countdown > 0;

  useEffect(() => {
    if (isDisabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  const handleResendCode = async () => {
    const email = searchParams.get("email");
    if (email) {
      await resendLoginCodeAction(email);
      setCountdown(INITIAL_COUNTDOWN);
    }
  };

  const submitAction = async () => {
    const { code } = form.getValues();

    const response = await signIn("code", {
      code,
      callbackUrl: "/admin/dashboard",
      redirect: false,
    });

    if (!response) {
      throw Error("expected a response from next-auth");
    }
    if (!response.ok) {
      form.setError("code", { message: t("codeFailed") });
      return;
    }
    router.push(response.url || route("admin.dashboard.index", params));
  };

  return (
    <Form {...form}>
      <div className="max-w-[400px] flex flex-col items-center justify-center container gap-8 px-4.5 lg:px-0">
        <div className="w-full justify-center items-center flex flex-col gap-4">
          <MailIcon />
          <h6 className="font-semibold text-2xl">{t("checkmail")}</h6>
          <p className="text-black-700 text-center">
            {t("para1")}{" "}
            <span className="font-medium">{searchParams.get("email")}</span>.{" "}
            {t("para2")}
          </p>
        </div>

        <div className="w-full justify-center items-center flex flex-col gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("code")}</FormLabel>
                <FormControl>
                  <Input placeholder="ABC123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormSubmit
            className="w-full"
            form={form}
            onClick={form.handleSubmit(submitAction)}
          >
            {t("loginWithCode")}
          </FormSubmit>

          <div className="flex flex-col-reverse lg:flex-row lg:justify-evenly gap-3 w-full">
            <Link
              className={cn(
                "hidden sm:flex",
                buttonVariants({ variant: "tertiary", size: "md" })
              )}
              href="/admin"
            >
              <ArrowLeftIcon />
              {t("backclick")}
            </Link>

            <Button
              variant={"secondary"}
              size={"md"}
              icon={<MailLogoIcon />}
              disabled={isDisabled}
              onClick={handleResendCode}
            >
              {isDisabled ? `Resend in ${countdown}s` : "Resend magic link"}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default CheckmailPage;
