import React, { useState, useMemo, useEffect } from 'react';
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
import { cn } from '@/lib/utils';

interface AgencyListDropdownProps {
  agencies: Agency[];
  version: 'modal' | 'card' | 'usermodal';
  setAgency?: React.Dispatch<React.SetStateAction<number | null>>;
  userAgency?: number | null;
  selectedAgency?: string;
  setSelectedAgency?: (agencyAcronym: string) => void;
  setSuccessMessage?: (message: string) => void;
  questionId?: number;
}

const AgencyListDropdownRefactored: React.FC<AgencyListDropdownProps> = ({
  agencies,
  version,
  setAgency,
  userAgency,
  selectedAgency = '',
  setSelectedAgency = () => {},
  setSuccessMessage = () => {},
  questionId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgencyAcronym, setSelectedAgencyAcronym] = useState<
    string | null
  >(null);
  const [selectedAgencyName, setSelectedAgencyName] = useState<string | null>(
    null,
  );
  const [hoveredAgency, setHoveredAgency] = useState<number | null>(null);
  const [hoveredAgencyName, setHoveredAgencyName] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (
      version === 'usermodal' &&
      userAgency !== null &&
      userAgency !== undefined
    ) {
      const agency = agencies.find(a => a.id === userAgency);
      if (agency) {
        setSelectedAgencyAcronym(agency.acronym);
        setSelectedAgencyName(agency.name);
      }
    }
  }, [userAgency, agencies, version]);

  const filteredAgencies = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return agencies.filter(
      agency =>
        agency.acronym.toLowerCase().includes(lowercasedQuery) ||
        agency.name.toLowerCase().includes(lowercasedQuery) ||
        (agency.name_ms &&
          agency.name_ms.toLowerCase().includes(lowercasedQuery)),
    );
  }, [agencies, searchQuery]);

  const handleAgencyChange = (
    agencyId: number,
    agencyAcronym: string,
    agencyName: string,
  ) => {
    if (version === 'usermodal') {
      if (agencyId === 0) {
        setSelectedAgencyAcronym(null);
        setSelectedAgencyName(null);
      } else {
        setSelectedAgencyAcronym(agencyAcronym);
        setSelectedAgencyName(agencyName);
      }
      if (agencyId !== 0 && setAgency) {
        setAgency(agencyId);
      }
    } else {
      setSelectedAgency(agencyAcronym);
      if (questionId) {
        assignAgencyToQuestion(questionId, agencyId);
      }
      if (agencyAcronym !== 'Unassigned') {
        setSuccessMessage(
          `Successfully assigned to ${agencyAcronym}. Their PIC will be able to answer this question.`,
        );
      } else {
        setSuccessMessage('');
      }
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleMouseEnter = (agencyId: number, agencyName: string) => {
    setHoveredAgency(agencyId);
    setHoveredAgencyName(agencyName);
  };

  const handleMouseLeave = () => {
    setHoveredAgency(null);
    setHoveredAgencyName(null);
  };

  const displayTextAcronym = hoveredAgency
    ? filteredAgencies.find(agency => agency.id === hoveredAgency)?.acronym ||
      'Unassigned'
    : selectedAgencyAcronym || selectedAgency || 'Unassigned';
  const displayTextName = hoveredAgency
    ? hoveredAgencyName
    : selectedAgencyName;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'flex items-center justify-between p-2 rounded-lg cursor-pointer border-outline-200 border shadow-button font-medium text-black-700 ',
            {
              'w-full h-10 ': version === 'modal',
              'w-full h-10 text-sm bg-white px-3 ': version === 'usermodal',
              'w-[130px] h-8 text-sm bg-background': version === 'card',
            },
          )}
        >
          <div className="pr-2 truncate">
            {displayTextAcronym}
            {version === 'usermodal' && displayTextName && (
              <span className="ml-2 text-xs text-dim-500">
                {displayTextName}
              </span>
            )}
          </div>
          <ChevronDown className="h-5 w-5" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn('p-0 rounded-[14px] top-[-48px] relative', {
          'md:max-w-[616px] w-[616px]': version === 'modal',
          'md:max-w-[550px] w-[550px]': version === 'usermodal',
          'md:min-w-[320px] w-[320px]': version === 'card',
        })}
        align="start"
      >
        <div className="p-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for agency name"
            className={cn('w-full p-2 border border-gray-300 rounded-md', {
              'h-8': version === 'card',
              'h-10': version !== 'card',
            })}
          />
        </div>
        <div className="p-2 pt-0">
          <ScrollArea className="h-[160px] w-full pr-1 pt-0">
            <div className="pr-2">
              <div
                onClick={() => handleAgencyChange(0, 'Unassigned', '')}
                className="font-medium p-2 hover:bg-washed-100 cursor-pointer rounded-md text-sm h-8 items-center flex"
              >
                Unassigned
              </div>

              {filteredAgencies.map(agency => (
                <div
                  key={agency.id}
                  onClick={() =>
                    handleAgencyChange(agency.id, agency.acronym, agency.name)
                  }
                  onMouseEnter={() => handleMouseEnter(agency.id, agency.name)}
                  onMouseLeave={handleMouseLeave}
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

export default AgencyListDropdownRefactored;
