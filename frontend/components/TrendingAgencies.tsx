'use client';
import { useTranslations } from 'next-intl';
import { AGENCY_TO_UUID } from '@/lib/agency';
import JataNegaraIcon from '@/icons/jatanegaraicon';

const AgencyList = () => {
  const t = useTranslations('Agency');
  const agencylists = Object.entries(AGENCY_TO_UUID).map(([name, id]) => ({
    id,
    name: t(name),
  }));

  const top5Agencies = agencylists.slice(0, 5);

  return (
    <div className="pt-4">
      <ul className="flex flex-col justify-between h-full">
        {top5Agencies.map(agency => (
          <li key={agency.id} className="py-2">
            <div className="flex items-center ">
              <div className="pr-2">
                <JataNegaraIcon className="stroke-[#E4E4E7] dark:stroke-[#27272A] w-8 h-8"></JataNegaraIcon>
              </div>
              <div className="text-base font-normal text-black-800">
                {agency.name}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgencyList;
