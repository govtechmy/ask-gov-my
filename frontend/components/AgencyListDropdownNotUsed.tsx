// agency list dropdown to use in admin later on
'use client';
import { useTranslations } from 'next-intl';
import { getDynamicAgencyMap } from '@/actions/questionServices';

const AgencyListDropdownNotUsed = () => {
  const t = useTranslations('Agency');
  const AGENCY_TO_UUID = getDynamicAgencyMap()
  const agencylists = Object.entries(AGENCY_TO_UUID).map(([name, id]) => ({
    id,
    name,
  }));

  return (
    <div>
      <label htmlFor="agency-dropdown" className=""></label>
      <select id="agency-dropdown" name="agency" className="">
        {agencylists.map(agency => (
          <option key={agency.id} value={agency.id}>
            {agency.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AgencyListDropdownNotUsed;
