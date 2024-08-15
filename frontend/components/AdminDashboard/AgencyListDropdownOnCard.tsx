import React, { useState, ChangeEvent } from 'react';
import { Agency } from '@/types/types';
import { assignAgencyToQuestion } from '@/actions/userServices';

interface AgencyListDropdownProps {
  selectedAgency: string;
  setSelectedAgency: (agencyAcronym: string) => void;
  setSuccessMessage: (message: string) => void;
  activeQuestionId: number | null;
  setactiveQuestionId: React.Dispatch<React.SetStateAction<number | null>>;
  questionId: number;
  agencies: Agency[];
}

const AgencyListDropdownOnCard: React.FC<AgencyListDropdownProps> = ({
  selectedAgency,
  setSelectedAgency,
  setSuccessMessage,
  activeQuestionId,
  setactiveQuestionId,
  questionId,
  agencies,
}) => {
  // const [isOpen, setIsOpen] = useState(questionId === activeQuestionId);
  const [searchQuery, setSearchQuery] = useState('');

  const isOpen = questionId === activeQuestionId;

  const handleDropdownToggle = () => {
    if (isOpen) {
      // Close the dropdown
      // setIsOpen(false);
      setactiveQuestionId(null);
    } else {
      // Open the dropdown
      // setIsOpen(true);
      setactiveQuestionId(questionId);
    }
    setSuccessMessage('');
  };

  const handleAgencyChange = (agencyId: number, agencyAcronym: string) => {
    setSelectedAgency(agencyAcronym);
    assignAgencyToQuestion(questionId, agencyId);
    // setIsOpen(false);
    setactiveQuestionId(null); // Ensure that dropdown is closed
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
    <div className="relative">
      <div
        className={`hover:cursor-pointer bg-background font-medium text-sm text-black-700 h-8 w-[130px] items-center flex border-[1px] border-outline-200 shadow-button px-2 ${
          isOpen ? ' rounded-full' : 'rounded-lg'
        }`}
        onClick={handleDropdownToggle}
      >
        {!isOpen && selectedAgency}
      </div>
      {isOpen && (
        <div className="absolute top-[-20px] left-0 mt-2 w-[311px] h-[220px] rounded-2xl bg-white-forcewhite border-[1px] border-outline-200 z-10">
          <div className="absolute top-10 right-2 mt-3 overflow-auto max-h-[160px] bg-white-forcewhite w-[295px]">
            <div
              className="text-black-900 font-medium text-sm h-8  pl-3 hover:bg-washed-100 cursor-pointer items-center flex"
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
              className="absolute h-[40px] w-[295px] top-2 left-2 border-[1px] border-outline-200  rounded-lg p-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyListDropdownOnCard;
