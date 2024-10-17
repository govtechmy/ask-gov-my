"use client";

import { DeepKeys } from "@/types/types";
import { cn } from "@askgovmy/utils";
import { TranslationValues, useTranslations } from "next-intl";
import i18nKeys from "@/messages/en-GB.json";
import { ReactNode } from "react";

export type TranslationNamespace = DeepKeys<typeof i18nKeys>;

interface TranslatorProps {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  namespace: TranslationNamespace;
  values?: TranslationValues;
  className?: string;
  prefix?: ReactNode;
}

const Translator: React.FC<TranslatorProps> = ({
  tag = "p",
  namespace,
  values,
  className,
  prefix,
}) => {
  const t = useTranslations();
  const Tag = tag;

  return (
    <Tag className={cn("flex items-center", className)}>
      {prefix}
      {t(namespace, values ? values : {})}
    </Tag>
  );
};

export default Translator;
