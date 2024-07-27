import React, { useState, useRef, ChangeEvent, useEffect } from 'react';

interface AgencyListDropdownProps {
  AGENCY_TO_UUID: { [key: string]: string };
}

const AgencyListDropdownUsers: React.FC<AgencyListDropdownProps> = ({
  AGENCY_TO_UUID,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [hoveredAgency, setHoveredAgency] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAgencyChange = (agencyAcronym: string) => {
    setSelectedAgency(agencyAcronym === 'All' ? null : agencyAcronym);
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
    ? hoveredAgency || selectedAgency || 'All'
    : selectedAgency || 'All';

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="w-[170px] hover:cursor-pointer h-8 mr-2 text-sm font-normal items-center flex border-[1px] border-outline-200 bg-white pl-2 shadow-button rounded-lg cursor-pointer pr-2"
        onClick={handleDropdownToggle}
      >
        {`Agency: ${displayText}`}
      </div>
      {isOpen && (
        <div className="absolute mt-2 w-[320px] h-[220px] rounded-2xl bg-white-forcewhite border-[1px] border-outline-200 z-10">
          <div className="absolute left-2 overflow-auto mt-[52px] max-h-[160px] bg-white-forcewhite max-w-[300px] rounded-md">
            <div
              className="h-8 w-[300px] pl-2 hover:bg-washed-100 cursor-pointer items-center flex rounded-md"
              onClick={() => handleAgencyChange('All')}
            >
              All
            </div>
            {filteredAgencies.map(agencyAcronym => (
              <div
                key={agencyAcronym}
                className="pl-2 h-8 hover:bg-washed-100 cursor-pointer items-center flex rounded-md"
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

          <div>
            <input
              type="text"
              placeholder="Search for agency name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="absolute h-[40px] w-[304px] top-2 left-2 border-[1px] border-outline-200 shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#E2D5FE] rounded-lg p-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyListDropdownUsers;
