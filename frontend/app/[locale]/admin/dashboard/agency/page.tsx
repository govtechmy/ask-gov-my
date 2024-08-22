'use client';

import React, { useEffect, useState } from 'react';
import { getAgencyList } from '@/actions/questionServices';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import PlusIcon from '@/icons/plusicon';
import { Agency } from '@/types/types';
import AgencyCard from '@/components/AdminDashboard/AgencyCard';
import Pagination from '@/components/ui/pagination';
import AddAgencyModal from '@/components/AdminDashboard/AddAgencyModal';

const ManageAgencies: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [paginatedAgencies, setPaginatedAgencies] = useState<Agency[]>([]);

  const itemsPerPage = 36;
  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);

  const fetchAgencies = async () => {
    try {
      const agencyList = await getAgencyList();
      setAgencies(agencyList);
      setFilteredAgencies(agencyList);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  useEffect(() => {
    const results = agencies.filter(agency =>
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredAgencies(results);
    setCurrentPage(1);
  }, [searchTerm, agencies]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <p>Loading agencies...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container max-w-screen-lg pt-3 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Manage agencies</h1>
        <div className="flex">
          <div
            className={cn(
              'bg-[#FFFFFF] dark:bg-[#18181B] rounded-md flex items-center h-8 w-[260px] border px-3 py-2 text-sm',
              {
                'shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]':
                  isFocused,
              },
            )}
          >
            <input
              type="search"
              placeholder="Search by agency or ID"
              value={searchTerm}
              className="font-normal placeholder:text-dim-500 flex h-11 w-full rounded-md bg-transparent py-3 text-sm pl-2 focus:outline-none"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="h-4 w-4 items-center justify-center flex">
              <Search strokeWidth={1.88} className="stroke-[#A1A1AA]" />
            </div>
          </div>
          <div
            className="w-[125px] h-8 rounded-md items-center justify-center flex text-white-forcewhite font-medium text-sm ml-2
            bg-gradient-to-t from-[#702FF9] to-[#B379FF] dark:from-[#702FF9] dark:to-[#B379FF] border-[1px] border-[#702FF9]"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="h-4 w-4 flex items-center justify-center mr-[6px]">
              <PlusIcon className="stroke-white-forcewhite" />
            </div>
            <div>New agency</div>
          </div>
        </div>
      </div>

      {filteredAgencies.length === 0 ? (
        <p className="text-left text-dim-500 font-normal text-base">
          We couldn't find the agency. Please try searching again using the
          search bar above.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {paginatedAgencies.map(agency => (
              <AgencyCard
                key={agency.id}
                id={agency.id}
                name={agency.name}
                name_ms={agency.name_ms}
                acronym={agency.acronym}
                logo_url={agency.logo_url}
                onUpdate={fetchAgencies}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredAgencies.length}
            setPaginatedItems={setPaginatedAgencies}
            items={filteredAgencies}
          />
        </>
      )}
      <AddAgencyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={fetchAgencies}
      />
    </div>
  );
};

export default ManageAgencies;
