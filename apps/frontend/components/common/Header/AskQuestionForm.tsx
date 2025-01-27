"use client";

import { submitQuestion } from "@/actions/public/question";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@askgovmy/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  question: z.string().min(1).max(255),
  email: z.string().email(),
});
type FormValues = z.infer<typeof schema>;

export function AskQuestionForm({
  onSubmit,
}: {
  onSubmit?: (values: FormValues) => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      question: "",
      email: "",
    },
  });

  const t = useTranslations("Askquestions");

  const handleSubmit = form.handleSubmit(async ({ email, question }) => {
    const recaptchaToken = await window.grecaptcha.enterprise.execute(
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
      { action: "SUBMIT_QUESTION" }
    );
    await submitQuestion({
      question,
      email,
      recaptcha_token: recaptchaToken,
    });
    onSubmit?.({ email, question });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("your_question")}</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder={t("type_your_question")}
                  className="mt-[6px] h-[120px] text-left pl-3 pt-2 w-full rounded-lg shadow-sm border-[1px] border-outline-200
                     focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]
                     placeholder:text-black-900 placeholder:font-normal placeholder:text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("notify_me")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="mail@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-sm font-normal pt-[6px] mb-6 text-dim-500">
          {t("email_updates")}
        </div>

        <div className="flex border border-askmygovbrand-200 shadow-sm rounded-md w-full bg-askmygovbrand-50">
          <div className="p-3">
            <InfoIcon className="stroke-askmygovbrand-600" />
          </div>
          <div className="text-sm font-normal text-black-700 py-3 pr-3">
            <p>
              {t("response_time_p1")}
              <span className="text-askmygovbrand-600 font-semibold">
                {" "}
                {t("response_time_p2")}{" "}
              </span>
              {t("response_time_p3")}
            </p>

            <p className="pt-3">
              {t("response_public_p1")}
              <span className="text-askmygovbrand-600 font-semibold">
                {" "}
                {t("response_public_p2")}{" "}
              </span>
              {t("response_public_p3")}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center pt-9 pb-[18px]">
          <Button
            type="submit"
            onClick={handleSubmit}
            variant={"primary"}
            disabled={form.formState.isSubmitting}
          >
            {t("submit")}
          </Button>
          <div className="text-dim-500 font-normal text-sm text-pretty text-center mt-3">
            <p className="mb-3">{t("terms")}</p>
            <p>
              {t.rich("recaptcha_terms", {
                ["privacy-policy"]: (chunks) => (
                  <a
                    target="_blank"
                    href="https://policies.google.com/privacy"
                    className="underline"
                  >
                    {chunks}
                  </a>
                ),
                ["terms-of-service"]: (chunks) => (
                  <a
                    target="_blank"
                    href="https://policies.google.com/terms"
                    className="underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </div>
      </form>
    </Form>
  );
}
