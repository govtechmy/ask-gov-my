'use client';
import { useTranslations } from 'next-intl';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import { Link } from '@/lib/i18n';

export interface Agency {
  id: number;
  name: string;
  name_ms: string;
  acronym: string;
  total_likes: number;
}

interface TrendingAgenciesProps {
  agencies: Agency[];
}

const TrendingAgencies: React.FC<TrendingAgenciesProps> = ({ agencies }) => {
  const t = useTranslations('Agency');
  const top5Agencies = agencies.slice(0, 5);

  return (
    <div className="pt-4">
      <ul className="flex flex-col justify-between h-full">
        {top5Agencies.map(agency => (
          <li key={agency.id} className="py-2">
            <Link href={`/${agency.acronym.toLowerCase()}`}>
              <div className="flex items-center">
                <div className="pr-2">
                  <JataNegaraIcon className="stroke-[#E4E4E7] dark:[#27272A] w-8 h-8" />
                </div>
                <div className="text-base font-normal text-black-800">
                  {t(agency.acronym)}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingAgencies;
