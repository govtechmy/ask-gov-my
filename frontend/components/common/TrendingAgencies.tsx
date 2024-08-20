'use client';
import { useParams } from 'next/navigation';
import { Link } from '@/lib/i18n';
import AgencyLogoImporter from './AgencyLogoImporter';
import { Agency } from '@/types/types';

interface TrendingAgenciesProps {
  trendingAgencies: Agency[];
}

const TrendingAgencies: React.FC<TrendingAgenciesProps> = ({
  trendingAgencies,
}) => {
  const params = useParams();
  const locale = params.locale;

  const top10Agencies = trendingAgencies.slice(0, 10);

  return (
    <div className="pt-6">
      <ul className="flex flex-col justify-between h-full pb-5">
        {top10Agencies.map((agency: Agency) => (
          <li key={agency.id} className="py-[9px]">
            <Link href={`/${agency.acronym.toLowerCase()}`}>
              <div className="flex items-center">
                <div className="pr-[10px] items-center">
                  <div className="h-8 w-8 flex relative flex-shrink-0">
                    <AgencyLogoImporter currentAgency={agency} />
                  </div>
                </div>
                <div className="text-base font-normal text-black-800 hover:text-askmygovtextbrand-600 hover:cursor-pointer">
                  {locale === 'ms' ? agency.name_ms : agency.name}
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
