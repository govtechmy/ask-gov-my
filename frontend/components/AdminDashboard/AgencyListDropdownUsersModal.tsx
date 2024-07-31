import ChevronDown from '@/icons/ChevronDown';
import Search from '@/icons/search';
import React, { useState, useRef, ChangeEvent } from 'react';

interface AgencyListDropdownProps {
  AGENCY_TO_UUID: Promise<Record<string, string>>;
  initialSelectedAgency?: string; // Added prop for initial selected agency
}

const AgencyListDropdownUsers: React.FC<AgencyListDropdownProps> = ({
  AGENCY_TO_UUID,
  initialSelectedAgency,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string | null>(
    initialSelectedAgency || null,
  );
  const [hoveredAgency, setHoveredAgency] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAgencyChange = (agencyAcronym: string) => {
    setSelectedAgency(agencyAcronym === 'Unassigned' ? null : agencyAcronym);
    setIsOpen(false);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleMouseEnter = (agencyAcronym: string) => {
    setHoveredAgency(agencyAcronym);
  };

  const handleMouseLeave = () => {
    setHoveredAgency(null);
  };

  const filteredAgencies = Object.keys(AGENCY_TO_UUID).filter(agencyAcronym =>
    agencyAcronym.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const displayText = isOpen
    ? hoveredAgency || selectedAgency || 'Unassigned'
    : selectedAgency || 'Unassigned';

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="w-full hover:cursor-pointer h-10 text-sm font-medium items-center flex border-[1px] border-outline-200 bg-white pl-4 shadow-button rounded-lg cursor-pointer justify-between z-50"
        onClick={handleDropdownToggle}
      >
        {` ${displayText}`}
        <div className="pr-2">
          <ChevronDown
            className={`h-5 w-5 transition-transform transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="absolute mt-2 w-full h-[220px] rounded-2xl bg-white-forcewhite border-[1px] border-outline-200 z-10">
          <div className="absolute left-2 overflow-auto mt-[52px] max-h-[160px] bg-white-forcewhite max-w-[535px] rounded-md">
            <div
              className="h-8 w-[535px] pl-2 hover:bg-washed-100 cursor-pointer items-center flex rounded-md text-sm"
              onClick={() => handleAgencyChange('Unassigned')}
            >
              Unassigned
            </div>
            {filteredAgencies.map(agencyAcronym => (
              <div
                key={agencyAcronym}
                className="pl-2 h-8 hover:bg-washed-100 cursor-pointer items-center flex rounded-md text-sm"
                onClick={() => handleAgencyChange(agencyAcronym)}
                onMouseEnter={() => handleMouseEnter(agencyAcronym)}
                onMouseLeave={handleMouseLeave}
              >
                {agencyAcronym}
                <div className="text-dim-500 font-medium text-xs leading-[18px] pl-2 rounded-md">
                  {agencyAcronym}
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
              className="absolute h-[32px] w-[535px] top-2 left-2 border-[1px] border-outline-200
               shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA]
               focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]rounded-lg p-2"
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
