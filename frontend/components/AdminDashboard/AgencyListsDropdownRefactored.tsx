import React, { useState } from 'react';
import { Agency } from '@/types/types';
import { assignAgencyToQuestion } from '@/actions/userServices';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ChevronDown from '@/icons/ChevronDown';

interface AgencyListDropdownProps {
  selectedAgency: string;
  setSelectedAgency: (agencyAcronym: string) => void;
  setSuccessMessage: (message: string) => void;
  agencies: Agency[];
  questionId: number;
  version: 'modal' | 'card';
  activeQuestionId?: number | null;
  setactiveQuestionId?: React.Dispatch<React.SetStateAction<number | null>>;
}

const AgencyListDropdownRefactored: React.FC<AgencyListDropdownProps> = ({
  selectedAgency,
  setSelectedAgency,
  setSuccessMessage,
  agencies,
  questionId,
  version,
  activeQuestionId,
  setactiveQuestionId,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAgencyChange = (agencyId: number, agencyAcronym: string) => {
    setSelectedAgency(agencyAcronym);
    assignAgencyToQuestion(questionId, agencyId);
    if (version === 'modal') {
      setIsOpen(false);
    } else if (version === 'card' && setactiveQuestionId) {
      setactiveQuestionId(null);
    }
    if (agencyAcronym !== 'Unassigned') {
      setSuccessMessage(
        `Successfully assigned to ${agencyAcronym}. Their PIC will be able to answer this question.`,
      );
    } else {
      setSuccessMessage('');
    }
  };

  const handleDropdownToggle = () => {
    if (version === 'modal') {
      setIsOpen(!isOpen);
    } else if (version === 'card' && setactiveQuestionId) {
      if (questionId === activeQuestionId) {
        setactiveQuestionId(null);
      } else {
        setactiveQuestionId(questionId);
      }
    }
    setSuccessMessage('');
  };

  const isDropdownOpen =
    version === 'modal' ? isOpen : questionId === activeQuestionId;

  return (
    <Popover open={isDropdownOpen} onOpenChange={handleDropdownToggle}>
      <PopoverTrigger asChild>
        <div
          className={`
            flex items-center justify-between p-2 rounded-lg cursor-pointer
            ${
              version === 'modal'
                ? 'w-full h-10 border border-outline-200 shadow-button'
                : 'w-[130px] h-8 bg-background font-medium text-sm text-black-700 border border-outline-200 shadow-button'
            }
          `}
        >
          <div className="pr-2 truncate">
            {(!isDropdownOpen || version === 'modal') && selectedAgency}
          </div>
          <ChevronDown />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={`p-0 rounded-[14px] top-[-48px] relative 
        ${version === 'modal' ? 'md:max-w-[616px]  w-[616px]' : 'md:min-w-[320px] w-[320px]'}`}
        align="start"
      >
        <Command className="w-full">
          <CommandInput
            placeholder="Search for agency name"
            className={`${version === 'card' ? 'h-8' : 'h-10'}`}
          />
          <CommandList>
            <CommandEmpty>No agency found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[160px] w-full pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                <div className="pr-1">
                  <CommandItem
                    onSelect={() => handleAgencyChange(0, 'Unassigned')}
                  >
                    Unassigned
                  </CommandItem>
                  {agencies.map(agency => (
                    <CommandItem
                      key={agency.id}
                      onSelect={() =>
                        handleAgencyChange(agency.id, agency.acronym)
                      }
                      className="flex flex-row items-center py-2"
                    >
                      <div className="font-medium mr-2">{agency.acronym}</div>
                      <div className="text-dim-500 text-xs truncate w-0 flex-1">
                        {agency.name}
                      </div>
                    </CommandItem>
                  ))}
                </div>
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AgencyListDropdownRefactored;
