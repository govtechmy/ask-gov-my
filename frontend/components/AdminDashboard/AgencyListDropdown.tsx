import React, { useState, useRef, ChangeEvent } from 'react';

interface AgencyListDropdownProps {
  selectedAgency: string;
  setSelectedAgency: (agencyAcronym: string) => void;
  AGENCY_TO_UUID: { [key: string]: string };
  setSuccessMessage: (message: string) => void; // New prop
}

const AgencyListDropdown: React.FC<AgencyListDropdownProps> = ({
  selectedAgency,
  setSelectedAgency,
  AGENCY_TO_UUID,
  setSuccessMessage, // New prop
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    setSuccessMessage(''); // Clear the success message when the dropdown is opened
  };

  const handleAgencyChange = (agencyAcronym: string) => {
    setSelectedAgency(agencyAcronym);
    setIsOpen(false);
    if (agencyAcronym !== 'Unassigned') {
      setSuccessMessage(
        `Successfully assigned to ${agencyAcronym}. Their PIC will be able to answer this question.`,
      );
    } else {
      setSuccessMessage('');
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredAgencies = Object.keys(AGENCY_TO_UUID).filter(agencyAcronym =>
    agencyAcronym.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div ref={dropdownRef}>
      <div
        className={`h-10 items-center flex border-[1px] border-outline-200 pl-2 shadow-button ${
          isOpen ? 'hidden' : 'rounded-lg'
        }`}
        onClick={handleDropdownToggle}
      >
        {!isOpen && selectedAgency}
      </div>
      {isOpen && (
        <div className="relative mt-2 w-[616px] h-[220px] rounded-2xl bg-white-forcewhite border-[1px] border-outline-200">
          <div className="absolute top-0 right-[5px] overflow-auto max-h-[160px] bg-white-forcewhite max-w-[600px] mt-[52px]">
            <div
              className="h-8 w-[600px] pl-2 hover:bg-washed-100 cursor-pointer items-center flex"
              onClick={() => handleAgencyChange('Unassigned')}
            >
              Unassigned
            </div>

            {filteredAgencies.map(agencyAcronym => (
              <div
                key={agencyAcronym}
                className="pl-2 h-8 hover:bg-washed-100 cursor-pointer items-center flex"
                onClick={() => handleAgencyChange(agencyAcronym)}
              >
                {agencyAcronym}
                <div className="text-dim-500 font-medium text-xs leading-[18px] pl-2">
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
              className="absolute h-[40px] w-[600px] top-2 left-2 border-[1px] border-outline-200 shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#E2D5FE] rounded-lg p-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyListDropdown;
