import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n';
import AgencyLogoImporter from './AgencyLogoImporter';

interface TrendingAgency {
  id: number;
  name: string;
  name_ms?: string;
  acronym: string;
  total_likes?: number;
  logo_url?: string;
}

interface TrendingAgenciesProps {
  trendingAgencies: TrendingAgency[];
}

const TrendingAgencies: React.FC<TrendingAgenciesProps> = ({
  trendingAgencies,
}) => {
  const t = useTranslations('Agency');
  const top10Agencies = trendingAgencies.slice(0, 10);

  return (
    <div className="pt-6">
      <ul className="flex flex-col justify-between h-full pb-5">
        {top10Agencies.map((agency: TrendingAgency) => (
          <li key={agency.id} className="py-[9px]">
            <Link href={`/${agency.acronym.toLowerCase()}`}>
              <div className="flex items-center">
                <div className="pr-[10px] items-center">
                  <div className="h-8 w-8 flex relative flex-shrink-0">
                    <AgencyLogoImporter currentAgency={agency} />
                  </div>
                </div>
                <div className="text-base font-normal text-black-800 hover:text-askmygovtextbrand-600 hover:cursor-pointer">
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
