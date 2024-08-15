import ChevronDown from '@/icons/ChevronDown';
import Search from '@/icons/search';
import React, {
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { Agency } from '@/types/types';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface AgencyListDropdownProps {
  agencies: Agency[];
  setAgency: Dispatch<SetStateAction<number | null>>;
  userAgency?: number | null;
}

const AgencyListDropdownUsers: React.FC<AgencyListDropdownProps> = ({
  agencies,
  setAgency,
  userAgency,
}) => {
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userAgency !== null) {
      const agency = agencies.find(agency => agency.id === userAgency);
      if (agency) {
        setSelectedAgencyAcronym(agency.acronym);
        setSelectedAgencyName(agency.name);
      }
    }
  }, [userAgency, agencies]);

  const handleAgencyChange = (
    agencyId: number,
    agencyAcronym: string,
    agencyName: string,
  ) => {
    if (agencyId === 0) {
      setSelectedAgencyAcronym(null);
      setSelectedAgencyName(null);
    } else {
      setSelectedAgencyAcronym(agencyAcronym);
      setSelectedAgencyName(agencyName);
    }
    if (agencyId !== 0) {
      setAgency(agencyId);
    }
    setIsOpen(false); // Close the Popover after selection
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleMouseEnter = (
    agencyId: number,
    agencyAcronym: string,
    agencyName: string,
  ) => {
    setHoveredAgency(agencyId);
    setHoveredAgencyName(agencyName);
  };

  const handleMouseLeave = () => {
    setHoveredAgency(null);
    setHoveredAgencyName(null);
  };

  const filteredAgencies = agencies.filter(
    agency =>
      agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.acronym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agency.name_ms.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const displayTextAcronym = hoveredAgency
    ? filteredAgencies.find(agency => agency.id === hoveredAgency)?.acronym ||
      'Unassigned'
    : selectedAgencyAcronym || 'Unassigned';
  const displayTextName = hoveredAgency
    ? hoveredAgencyName
    : selectedAgencyName;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <div className="w-full hover:cursor-pointer h-10 text-sm font-medium items-center flex border-[1px] border-outline-200 bg-white pl-4 shadow-button rounded-lg cursor-pointer z-50 justify-between">
          <div>
            {displayTextAcronym}
            {displayTextName && (
              <span className="ml-2 text-xs text-dim-500">
                {displayTextName}
              </span>
            )}
          </div>
          <div className="pr-2">
            <ChevronDown className="h-5 w-5 transition-transform transform" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-0 rounded-lg">
        <div className="rounded-lg border bg-background shadow-md">
          <div className="p-2 bg-white rounded-md">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for agency name"
                value={searchQuery}
                onChange={handleSearchChange}
                className="pr-8"
              />
              <Search className="absolute right-[10px] top-[10px] stroke-outline-400" />
            </div>
          </div>
          <ScrollArea className="h-[170px]">
            <div className="p-2">
              <div
                className="flex h-8 cursor-pointer items-center rounded-md px-2 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleAgencyChange(0, 'Unassigned', '')}
              >
                Unassigned
              </div>
              {filteredAgencies.map(agency => (
                <div
                  key={agency.id}
                  className="flex h-8 cursor-pointer items-center rounded-md px-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() =>
                    handleAgencyChange(agency.id, agency.acronym, agency.name)
                  }
                  onMouseEnter={() =>
                    handleMouseEnter(agency.id, agency.acronym, agency.name)
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  {agency.acronym}
                  <span className="ml-2 text-xs text-dim-500">
                    {agency.name}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AgencyListDropdownUsers;
