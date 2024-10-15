"use client";

import { DeepKeys } from "@/types/types";
import { cn } from "@askgovmy/utils";
import { TranslationValues, useTranslations } from "next-intl";
import i18nKeys from "@/messages/en-GB.json";

interface TranslatorProps {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  namespace: DeepKeys<typeof i18nKeys>;
  values?: TranslationValues;
  className?: string;
}

const Translator: React.FC<TranslatorProps> = ({
  tag = "p",
  namespace,
  values,
  className,
}) => {
  const t = useTranslations();
  const Tag = tag;

  return (
    <Tag className={cn("", className)}>
      {t(namespace, values ? values : {})}
    </Tag>
  );
};

export default Translator;
