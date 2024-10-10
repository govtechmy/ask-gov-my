"use client";

import { cn } from "@askgovmy/utils";
import { TranslationValues, useTranslations } from "next-intl";

interface WordTranslateProps {
  translate: string;
  keyword: string;
  values?: TranslationValues;
  className?: string;
}

const WordTranslate: React.FC<WordTranslateProps> = ({
  translate,
  keyword,
  values,
  className,
}) => {
  const t = useTranslations(translate);

  return (
    <p className={cn("", className)}>{t(keyword, values ? values : {})}</p>
  );
};

export default WordTranslate;
