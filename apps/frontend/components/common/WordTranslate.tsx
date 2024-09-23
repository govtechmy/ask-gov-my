'use client';

import { useTranslations } from 'next-intl';

interface WordTranslateProps {
  translate: string | undefined;
  keyword: string | undefined;
}

const WordTranslate: React.FC<WordTranslateProps> = ({
  translate,
  keyword,
}) => {
  const t = useTranslations(translate);

  return <p>{t(keyword)}</p>;
};

export default WordTranslate;
