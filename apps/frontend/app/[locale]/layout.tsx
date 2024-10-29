import { Inter, Poppins } from "next/font/google";
import "@/styles/globals.css";
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { locales } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "next-themes";
import Providers from "./providers/providers";
import { Suspense } from "react";
import Masthead from "@/components/layout/masthead";
import { AutoToast } from "@askgovmy/ui";
import { FSM } from "@/lib/decorator";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export async function generateMetadata(params: FSM) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Site" });

  return {
    title: {
      default: t("name"),
    },
    description: t("description"),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={cn(inter.className, inter.variable, poppins.variable)}>
        <ThemeProvider attribute="class">
          <NextIntlClientProvider messages={messages}>
            <Suspense>
              <Providers>
                <Masthead></Masthead>
                {children}
              </Providers>
            </Suspense>
            <AutoToast duration={3000} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
