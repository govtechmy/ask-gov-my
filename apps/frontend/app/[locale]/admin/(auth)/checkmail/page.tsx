"use client";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import { Button, buttonVariants } from "@/components/ui/button";
import Maillogo from "@/icons/mail";
import Arrowleft from "@/icons/arrowleft";
import { useTranslations } from "next-intl";
import MailLogo from "@/icons/maillogo";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import BaseHeader from "@/components/common/Header/BaseHeader";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const CheckmailPage = ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  const t = useTranslations("Checkmail");
  // const { data: session } = useSession();
  const [isDisabled, setIsDisabled] = useState(true); // Initially set to true
  const [countdown, setCountdown] = useState(60); // Countdown timer in 60 seconds edit here later
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isDisabled && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (countdown === 0) {
      setIsDisabled(false);
    }
  }, [isDisabled, countdown]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      e.preventDefault();
    }
  };

  const submitAction = async (formData: FormData) => {
    const code = formData.get("code");
    if (typeof code !== "string") {
      throw Error("invalid code type");
    }

    const response = await signIn("code", {
      code,
      callbackUrl: "/admin/dashboard",
      redirect: false,
    });

    if (!response) {
      throw Error("expected a response from next-auth");
    }
    if (!response.ok) {
      setErrorMsg(t("codeFailed"));
      return;
    }
    router.push(response.url || "/admin/dashboard");
  };

  return (
    <>
      <div className="flex-grow flex items-center justify-center py-12">
        <div className="flex flex-col items-center justify-center">
          <Maillogo />
          <div className="font-semibold text-2xl py-4">{t("checkmail")}</div>
          <div className="font-normal text-base text-zinc-700 dark:text-zinc-300">
            {t("para1")}
          </div>

          <div className="flex pb-6">
            <div className="font-medium text-base px-1">
              {/* {session?.user?.email || 'yourname@example.com'} */}
            </div>
            <div className="font-normal text-base text-zinc-700 dark:text-zinc-300">
              {t("para2")}
            </div>
          </div>

          <form className="block space-y-3" action={submitAction}>
            <Input required placeholder="ABC123" name="code" />
            <Button variant="primary" className="w-full" type="submit">
              {t("loginWithCode")}
            </Button>
            {errorMsg && (
              <p className=" text-danger-600 font-normal text-base sm:max-w-[339px] w-max-[400px]">
                {errorMsg}
              </p>
            )}
          </form>

          <div className="sm:flex gap-3 w-full mt-12">
            <div className="hidden sm:block">
              <Link
                className={buttonVariants({ variant: "tertiary", size: "md" })}
                href="/admin"
              >
                <Arrowleft />
                {t("backclick")}
              </Link>
            </div>
            <div>
              {/* new implementation for resending the magic email */}
              <Link
                className={cn(
                  buttonVariants({ variant: "secondary", size: "md" }),
                  "w-full",
                  isDisabled ? "opacity-40 cursor-not-allowed" : ""
                )}
                href={isDisabled ? "#" : "/admin"}
                onClick={handleClick}
                aria-disabled={isDisabled}
              >
                <MailLogo />
                {isDisabled ? `Resend in ${countdown}s` : "Resend magic link"}
              </Link>
            </div>

            <div className="sm:hidden mt-3">
              <Link
                className={cn(
                  buttonVariants({ variant: "tertiary", size: "md" }),
                  "w-full"
                )}
                href="/admin"
              >
                <Arrowleft />
                {t("backclick")}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer adminpage={true} />
    </>
  );
};

export default CheckmailPage;
