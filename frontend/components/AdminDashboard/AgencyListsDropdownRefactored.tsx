import React, { useState, useMemo } from 'react';
import { Agency } from '@/types/types';
import { assignAgencyToQuestion } from '@/actions/userServices';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import ChevronDown from '@/icons/ChevronDown';
import { Input } from '../ui/input';

interface AgencyListDropdownProps {
  selectedAgency: string;
  setSelectedAgency: (agencyAcronym: string) => void;
  setSuccessMessage: (message: string) => void;
  agencies: Agency[];
  questionId: number;
  version: 'modal' | 'card';
}

const AgencyListDropdownEnhanced: React.FC<AgencyListDropdownProps> = ({
  selectedAgency,
  setSelectedAgency,
  setSuccessMessage,
  agencies,
  questionId,
  version,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgencies = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return agencies.filter(
      agency =>
        agency.acronym.toLowerCase().includes(lowercasedQuery) ||
        agency.name.toLowerCase().includes(lowercasedQuery),
    );
  }, [agencies, searchQuery]);

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
    setSearchQuery('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
          <div className="pr-2 truncate">{selectedAgency}</div>
          <ChevronDown />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={`p-0 rounded-[14px] top-[-48px] relative 
        ${version === 'modal' ? 'md:max-w-[616px] w-[616px]' : 'md:min-w-[320px] w-[320px]'}`}
        align="start"
      >
        <div className="p-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for agency name"
            className={`w-full p-2 border border-gray-300 rounded-md ${version === 'card' ? 'h-8' : 'h-10'}`}
          />
        </div>
        <div className="p-2 pt-0">
          <ScrollArea className="h-[160px] w-full pr-1 pt-0">
            <div className="pr-2">
              <div
                onClick={() => handleAgencyChange(0, 'Unassigned')}
                className="font-medium p-2 hover:bg-washed-100 cursor-pointer rounded-md text-sm h-8 items-center flex"
              >
                Unassigned
              </div>

              {filteredAgencies.map(agency => (
                <div
                  key={agency.id}
                  onClick={() => handleAgencyChange(agency.id, agency.acronym)}
                  className="flex flex-row items-center p-2 hover:bg-gray-100 cursor-pointer rounded-md h-8"
                >
                  <div className="font-medium mr-2 text-sm">
                    {agency.acronym}
                  </div>
                  <div className="text-dim-500 text-xs truncate w-0 flex-1">
                    {agency.name}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AgencyListDropdownEnhanced;
