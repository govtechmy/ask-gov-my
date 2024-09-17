'use client';

import React from 'react';
import AgencyCard from '@/components/AdminDashboard/AgencyCard';
import Pagination from '../ui/pagination';
import { Agency } from '@/types/types';
import { useRouter } from '@/lib/i18n';
import { useSearchParams } from 'next/navigation';

interface AgencyBoxProps {
  data: {
    agencies: Agency[];
    totalPages: number;
    currentPage: number;
  };
}

const AgencyBox: React.FC<AgencyBoxProps> = ({ data }) => {
  const { agencies, totalPages, currentPage } = data;
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  };

  return (
    <div>
      {agencies.length === 0 ? (
        <p className="text-left text-dim-500 font-normal text-base">
          We couldn't find the agency. Please try searching again using the
          search bar above.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {agencies.map(agency => (
              <AgencyCard
                key={agency.id}
                id={agency.id}
                name={agency.name}
                name_ms={agency.name_ms}
                acronym={agency.acronym}
                logo_url={agency.logo_url}
                last_edited={agency.last_edited}
                onUpdate={() => {}}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default AgencyBox;
