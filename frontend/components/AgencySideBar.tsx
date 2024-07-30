// for this moment remove from main page. later may be used in other places
'use client';
import { useState } from 'react';
import { useRouter } from '@/lib/i18n';
import { getDynamicAgencyMap } from '@/actions/questionServices';
import { useTranslations } from 'next-intl';
import { Agency } from '@/types/types';

interface AgencySidebarProps {
  agencies: Agency[];
}

//important update on agency

const AgencySidebar: React.FC<AgencySidebarProps> = ({ agencies }) => {
  const t = useTranslations('Agency');
  const AGENCY_TO_UUID = getDynamicAgencyMap();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAgencyClick = (name: string) => {
    const id = AGENCY_TO_UUID[name as keyof typeof AGENCY_TO_UUID]; // Type assertion
    router.push(`/${name.toLowerCase()}`);
  };

  const formatAgencyName = (name: string) => {
    const words = name.split('_');
    const acronym = words.map(word => word.charAt(0).toUpperCase()).join('');

    const formattedName = words
      .map(word => {
        if (word.toLowerCase() === 'of') {
          return 'of';
        }
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
      })
      .join(' ');

    return { formattedName, acronym };
  };

  const filteredAgencies = agencies.filter(agency => {
    const { formattedName, acronym } = formatAgencyName(agency.name);
    return (
      formattedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acronym.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-4 lg:px-10">
      <div className="py-2 pb-4 font-semibold">{t('agency')}</div>
      <input
        type="text"
        placeholder="Search agencies..."
        className="mb-4 w-full rounded-md border border-gray-300 p-2"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ul className="space-y-2">
        {filteredAgencies.map(agency => {
          const { formattedName, acronym } = formatAgencyName(agency.name);
          return (
            <li
              key={agency.id}
              className="flex cursor-pointer rounded p-2 hover:bg-gray-200"
              onClick={() => handleAgencyClick(agency.name)}
            >
              <span className="truncate text-gray-500">{t(agency.name)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AgencySidebar;
