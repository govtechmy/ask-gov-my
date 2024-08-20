'use client';

import React, { useEffect, useState } from 'react';
import { getAgencyList } from '@/actions/questionServices';
import { uploadFile } from '@/actions/fileServices';
import { addAgency } from '@/actions/userServices';
import AgencyCard from './AgencyCard';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import PlusIcon from '@/icons/plusicon';
import Pencil from '@/icons/pencil';
import Asklogo from '@/icons/asklogo';
import { Agency } from '@/types/types';
import Pagination from '../ui/pagnination';
import ImageNext from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

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

  // Modal state
  const [name, setName] = useState('');
  const [nameMs, setNameMs] = useState('');
  const [acronym, setAcronym] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        if (img.width !== 200 || img.height !== 200) {
          setModalError('Image must be 200x200 pixels');
          return;
        }
        try {
          const url = await uploadFile(file);
          setLogoUrl(url);
        } catch (err) {
          if (err instanceof Error) {
            setModalError(err.message);
          } else {
            setModalError('An unexpected error occurred');
          }
          setSuccess(null);
        }
      };
    }
  };

  const handleSubmit = async () => {
    try {
      if (!name || !nameMs || !acronym || !logoUrl) {
        setModalError('All fields are required');
        return;
      }

      await addAgency(name, nameMs, acronym, logoUrl);
      setSuccess('Agency added successfully');
      setModalError(null);
      fetchAgencies();
      setIsModalOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        setModalError(err.message);
      } else {
        setModalError('An unexpected error occurred');
      }
      setSuccess(null);
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white rounded-xl shadow-lg w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-black-900 font-semibold text-lg leading-[26px]">
              Add New Agency
            </DialogTitle>
          </DialogHeader>
          <div className="h-[360px] w-[552px] m-6">
            <div className="mb-6">
              {logoUrl ? (
                <div className="relative">
                  <div className="w-[64px] h-[64px] relative flex-shrink-0">
                    <div className="absolute h-full w-full rounded-full border-[1px] border-outline-200 bg-transparent"></div>
                    <div className="flex items-center justify-center h-full w-full overflow-hidden rounded-full">
                      <ImageNext
                        src={logoUrl}
                        width={200}
                        height={200}
                        alt="Agency Logo"
                      />
                    </div>
                  </div>
                  <label className="cursor-pointer">
                    <div className="absolute bottom-0 left-[45px] h-5 w-5 rounded-full bg-askmygovbrand-600 items-center justify-center flex">
                      <div className="h-3 w-3 flex items-center justify-center">
                        <Pencil className="stroke-white-forcewhite"></Pencil>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-[64px] h-[64px] relative flex-shrink-0">
                    <div className="absolute h-full w-full rounded-full border-[1px] border-outline-200 bg-washed-100"></div>
                    <div className="flex items-center justify-center h-full w-full overflow-hidden rounded-full"></div>
                  </div>
                  <label className="cursor-pointer">
                    <div className="absolute bottom-0 left-[45px] h-5 w-5 rounded-full bg-askmygovbrand-600 items-center justify-center flex">
                      <div className="h-3 w-3 flex items-center justify-center">
                        <PlusIcon className="stroke-white-forcewhite"></PlusIcon>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
              <div className="mt-[6px] text-dim-500 text-sm">
                Upload photo ideally sized not more than 200x200 pixels in PNG
                or JPG format.
              </div>
            </div>
            <div className="mb-6">
              <div className="text-black-700 text-sm font-medium mb-[6px] w-[552px] h-5">
                Agency's name (English)
              </div>
              <input
                type="text"
                className="bg-white h-10 w-[552px] border-[1px] border-outline-200 rounded-lg pl-[12px]
                shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46] mb-6
                text-black-900 font-normal text-base"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <div className="text-black-700 text-sm font-medium mb-[6px] w-[552px] h-5">
                Agency's name (Malay)
              </div>
              <input
                type="text"
                className="bg-white h-10 w-[552px] border-[1px] border-outline-200 rounded-lg pl-[12px]
                shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46] mb-6
                text-black-900 font-normal text-base"
                value={nameMs}
                onChange={e => setNameMs(e.target.value)}
              />

              <div className="flex">
                <div>
                  <div className="text-black-700 text-sm font-medium mb-[6px] w-[264px] h-5">
                    Agency's acronym:
                  </div>
                  <input
                    type="text"
                    className="bg-white h-10 w-[264px] border-[1px] border-outline-200 rounded-lg pl-[12px]
                    shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46] mb-6
                    text-black-900 font-normal text-base"
                    value={acronym}
                    onChange={e => setAcronym(e.target.value)}
                  />
                </div>
                <div>{modalError}</div>
                <div className="h-[66px] w-[264px] ml-6">
                  <div className="text-black-700 text-sm font-medium mb-[6px] w-[264px] h-5">
                    Agency logo preview
                  </div>
                  <div className="font-poppins flex text-lg font-semibold items-center mt-[6px] h-10">
                    <Asklogo />
                    <div className="flex pl-[10px]">
                      Ask
                      <div className="text-[#702FF9] dark:text-[#9E70FF]">
                        {acronym}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              className="mr-3 h-[44px] w-[77px] border-[1px] border-outline-200 shadow-button rounded-lg 
              text-base items-center justify-center flex hover:cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="w-[119px] h-[44px] rounded-lg items-center justify-center flex text-base font-normal text-white-forcewhite 
              bg-gradient-to-t from-[#702FF9] to-[#B379FF] dark:from-[#702FF9] dark:to-[#B379FF]
              border-[1px] border-[#702FF9] hover:cursor-pointer shadow-button"
              onClick={handleSubmit}
            >
              Save
            </button>
          </DialogFooter>
          {success && <div className="text-green-500 mt-4">{success}</div>}
          {modalError && <div className="text-red-500 mt-4">{modalError}</div>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageAgencies;
