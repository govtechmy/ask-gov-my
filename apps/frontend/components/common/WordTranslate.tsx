"use client";

import { cn } from "@askgovmy/utils";
import { useTranslations } from "next-intl";

interface WordTranslateProps {
  translate: string | undefined;
  keyword: string | undefined;
  className?: string;
}

const WordTranslate: React.FC<WordTranslateProps> = ({
  translate,
  keyword,
  className,
}) => {
  const t = useTranslations(translate);

  return <p className={cn("", className)}>{t(keyword)}</p>;
};

export default WordTranslate;
