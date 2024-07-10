'use client';

import { useTranslations } from 'next-intl';

interface AgencyNameProps {
  acronym: string | undefined;
}

const AgencyName: React.FC<AgencyNameProps> = ({ acronym }) => {
  const t = useTranslations('Agency');

  if (!acronym) {
    return null;
  }

  return (
    <p>
      {t(acronym)} ({acronym}){' '}
    </p>
  );
};

export default AgencyName;
