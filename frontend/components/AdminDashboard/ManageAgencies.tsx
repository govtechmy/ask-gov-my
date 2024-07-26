'use client';

import React, { useEffect, useState } from 'react';
import { getAgencyList } from '@/actions/questionServices';
import AgencyCard from './AgencyCard';
import AddAgencyModal from './AddAgencyModal';
import RightArrow from '@/icons/rightarrow';
import LeftArrow from '@/icons/leftarrow';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import PlusIcon from '@/icons/plusicon';

interface Agency {
  id: number;
  name: string;
  name_ms: string;
  acronym: string;
  logo_url?: string;
}

const ManageAgencies: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  const renderPageNumbers = () => {
    const pageNumbers = [];

    pageNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`rounded-lg h-8 w-7 ${currentPage === 1 ? 'bg-[#F4EFFF] text-[#702FF9]' : 'bg-transparent text-black-700'}`}
      >
        {1}
      </button>,
    );

    if (currentPage > 1) {
      pageNumbers.push(
        <span key="ellipsis-start" className="px-2 py-2">
          ...
        </span>,
      );
    }

    let startPage, endPage;
    if (currentPage <= 2) {
      startPage = 2;
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
      endPage = totalPages - 1;
    } else {
      startPage = Math.max(2, currentPage - 1);
      endPage = Math.min(currentPage + 1, totalPages - 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`rounded-lg h-8 w-7 ${i === currentPage ? 'bg-[#F4EFFF] text-[#702FF9]' : 'bg-transparent text-black-700'}`}
        >
          {i}
        </button>,
      );
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push(
        <span key="ellipsis-end" className="px-2 py-2 rounded-lg">
          ...
        </span>,
      );
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`rounded-lg h-8 w-7 ${totalPages === currentPage ? 'bg-[#F4EFFF] text-[#702FF9]' : 'bg-transparent text-black-700'}`}
        >
          {totalPages}
        </button>,
      );
    }

    return <div className="flex rounded items-center">{pageNumbers}</div>;
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentAgencies = filteredAgencies.slice(startIdx, endIdx);

  if (loading) {
    return <p>Loading agencies...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className=" container max-w-screen-lg pt-3 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Manage agencies</h1>
        <div className="flex">
          <div
            className={cn(
              'bg-[#FFFFFF] dark:bg-[#18181B] rounded-md flex items-center h-8 w-[260px] border px-3 py-2 text-sm',
              {
                'shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#E2D5FE]': isFocused,
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
            <div className=" h-4 w-4 flex items-center justify-center mr-[6px]">
              <PlusIcon className="stroke-white-forcewhite"></PlusIcon>
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
            {currentAgencies.map(agency => (
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
          <div className="mt-4 rounded-lg flex items-center justify-center pb-7">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`rounded-lg h-8 w-8 bg-white shadow-button text-black-900 border-[1px] border-[#E4E4E7] ${currentPage === 1 ? ' opacity-30' : 'opacity-100'}`}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                <div className="flex items-center justify-center h-4 w-4">
                  <LeftArrow />
                </div>
              </div>
            </button>

            <div className="rounded-lg p-3">{renderPageNumbers()}</div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`rounded-lg h-8 w-8 bg-white shadow-button text-black-900 border-[1px] border-[#E4E4E7] ${currentPage === totalPages ? ' opacity-30' : 'opacity-100'}`}
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                <div className="flex items-center justify-center h-4 w-4">
                  <RightArrow />
                </div>
              </div>
            </button>
          </div>
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
