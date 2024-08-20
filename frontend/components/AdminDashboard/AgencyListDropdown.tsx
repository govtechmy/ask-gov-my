import React, { useState, useRef, ChangeEvent } from 'react';
import { Agency } from '@/types/types';
import { assignAgencyToQuestion } from '@/actions/userServices';

interface AgencyListDropdownProps {
  selectedAgency: string;
  setSelectedAgency: (agencyAcronym: string) => void;
  AGENCY_TO_UUID: { [key: string]: string };
  setSuccessMessage: (message: string) => void;
  agencies: Agency[];
  questionId: number;
}

const AgencyListDropdown: React.FC<AgencyListDropdownProps> = ({
  selectedAgency,
  setSelectedAgency,
  AGENCY_TO_UUID,
  setSuccessMessage,
  agencies,
  questionId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    setSuccessMessage(''); // Clear the success message when the dropdown is opened
  };

  const handleAgencyChange = (agencyId: number, agencyAcronym: string) => {
    setSelectedAgency(agencyAcronym);
    assignAgencyToQuestion(questionId, agencyId);
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

  const filteredAgencies = agencies.filter(
    agency =>
      agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agency.name_ms &&
        agency.name_ms.toLowerCase().includes(searchQuery.toLowerCase())),
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
              onClick={() => handleAgencyChange(0, 'Unassigned')}
            >
              Unassigned
            </div>

            {filteredAgencies.map(agency => (
              <div
                key={agency.id}
                className="text-black-900 font-medium text-sm pl-3 h-8 hover:bg-washed-100 cursor-pointer items-center flex"
                onClick={() => handleAgencyChange(agency.id, agency.acronym)}
              >
                {agency.acronym}
                <div className="text-dim-500 font-medium text-xs leading-[18px] pl-2">
                  {agency.name}
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
              className="absolute h-[40px] w-[600px] top-2 left-2 border-[1px] border-outline-200
               shadow-button focus:border-none focus:outline-none
               focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] rounded-lg p-2
               focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyListDropdown;
