import ChevronDown from '@/icons/ChevronDown';
import Search from '@/icons/search';
import React, { useState, useRef, ChangeEvent } from 'react';
import { Agency } from '@/types/types';

interface AgencyListDropdownProps {
  agencies: Agency[];
  selectedAgencyId: string;
  handleAgencyChange: (agencyId: string) => void;
}

const AgencyListDropdownUsers: React.FC<AgencyListDropdownProps> = ({
  agencies,
  selectedAgencyId,
  handleAgencyChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredAgency, setHoveredAgency] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleMouseEnter = (agencyId: string) => {
    setHoveredAgency(agencyId);
  };

  const handleMouseLeave = () => {
    setHoveredAgency(null);
  };

  const filteredAgencies = agencies.filter(
    agency =>
      agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.name_ms?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.acronym.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayText = isOpen
    ? hoveredAgency || (selectedAgencyId ? agencies.find(agency => agency.id === parseInt(selectedAgencyId))?.acronym || 'All' : 'All')
    : selectedAgencyId ? agencies.find(agency => agency.id === parseInt(selectedAgencyId))?.acronym || 'All' : 'All';

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="w-[200px] hover:cursor-pointer h-8 mr-2 text-sm font-normal items-center flex border-[1px] border-outline-200 bg-white pl-2 shadow-button rounded-lg cursor-pointer justify-between pr-2"
        onClick={handleDropdownToggle}
      >
        <div className="flex">
          <div className="text-dim-500 ">Agency</div>
          <div className="pl-[6px] text-black-900 font-medium">{displayText}</div>
        </div>

        <ChevronDown
          className={`h-5 w-5 transition-transform transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute mt-2 w-[320px] h-[220px] rounded-2xl bg-white-forcewhite border-[1px] border-outline-200 z-10">
          <div className="absolute left-2 overflow-auto mt-[52px] max-h-[160px] bg-white-forcewhite max-w-[300px] rounded-md">
            <div
              className="h-8 w-[300px] pl-2 hover:bg-washed-100 cursor-pointer items-center flex rounded-md"
              onClick={() => handleAgencyChange('')}
            >
              All
            </div>
            {filteredAgencies.map(agency => (
              <div
                key={agency.id}
                className="pl-2 h-8 hover:bg-washed-100 cursor-pointer items-center flex rounded-md"
                onClick={() => handleAgencyChange(agency.id.toString())}
                onMouseEnter={() => handleMouseEnter(agency.acronym)}
                onMouseLeave={handleMouseLeave}
              >
                {agency.acronym}
                <div className="text-dim-500 font-medium text-xs leading-[18px] pl-2 rounded-md">
                  {agency.name}
                </div>
              </div>
            ))}
          </div>

          <div className="flex">
            <input
              type="text"
              placeholder="Search for agency name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="absolute h-[32px] w-[304px] top-2 left-2 border-[1px] border-outline-200 
              shadow-button focus:border-none focus:outline-none 
              focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] rounded-lg p-2
              focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]"
            />
            <div className="absolute h-4 w-4 items-center justify-center flex z-20 right-[15px] top-[15px]">
              <Search strokeWidth={2} className="stroke-[#A1A1AA]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyListDropdownUsers;
