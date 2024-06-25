"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "@/lib/i18n";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function LocaleSwitch({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (locale: string) => {
    startTransition(() => {
      router.replace(
        `${pathname}?${searchParams}`,
        {
          locale,
          scroll: false,
        },
      );
    });
  };

  return (
    <Tabs defaultValue="en" value={locale} onValueChange={onSelectChange}>
      <TabsList className="bg-washed-100 dark:bg-background-50 h-8 gap-0 rounded-lg">
        {["ms", "en"].map((locale) => (
          <TabsTrigger
            key={locale}
            className="text-dim-500 data-[state=active]:border-outline-200 data-[state=active]:bg-background data-[state=active]:dark:bg-washed-100 h-full rounded-lg border data-[state=inactive]:border-transparent data-[state=active]:shadow-none"
            value={locale}
          >
            {locale === "en" ? "ENG" : "BM"}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
