import React, { useState, ChangeEvent } from 'react';

interface AgencyListDropdownProps {
  selectedAgency: string;
  setSelectedAgency: (agencyAcronym: string) => void;
  AGENCY_TO_UUID: { [key: string]: string };
  setSuccessMessage: (message: string) => void;
  activeQuestionId: number | null;
  setactiveQuestionId: React.Dispatch<React.SetStateAction<number | null>>;
  questionId: number;
}

const AgencyListDropdownOnCard: React.FC<AgencyListDropdownProps> = ({
  selectedAgency,
  setSelectedAgency,
  AGENCY_TO_UUID,
  setSuccessMessage,
  activeQuestionId,
  setactiveQuestionId,
  questionId,
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

  const handleAgencyChange = (agencyAcronym: string) => {
    setSelectedAgency(agencyAcronym);
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

  const filteredAgencies = Object.keys(AGENCY_TO_UUID).filter(agencyAcronym =>
    agencyAcronym.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  console.log(activeQuestionId);

  return (
    <div className="relative">
      {' '}
      {/* Ensure this container is relatively positioned */}
      <div
        className={`bg-background font-medium text-sm text-black-700 h-8 w-[130px] items-center flex border-[1px] border-outline-200 shadow-button px-2 ${
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
              onClick={() => handleAgencyChange('Unassigned')}
            >
              Unassigned
            </div>

            {filteredAgencies.map(agencyAcronym => (
              <div
                key={agencyAcronym}
                className="text-black-900 font-medium text-sm pl-3 h-8 hover:bg-washed-100 cursor-pointer items-center flex"
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
              className="absolute h-[40px] w-[295px] top-2 left-2 border-[1px] border-outline-200 shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#E2D5FE] rounded-lg p-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AgencyListDropdownOnCard;
