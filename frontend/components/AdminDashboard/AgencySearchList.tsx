'use client';

import { cn } from '@/lib/utils';
import { Agency } from '@/types/types';
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';

type PickedAgency = Pick<Agency, 'id' | 'acronym' | 'name' | 'name_ms'>;

type Props = {
  agencies: PickedAgency[];
  onItemClick: (value: PickedAgency | null) => void;
  inputSize?: 'sm' | 'md';
};

export function AgencySearchList({
  agencies,
  onItemClick,
  inputSize = 'md',
}: Props) {
  return (
    <Command
      filter={(_value, search, keywords) => {
        if (keywords?.some(keyword => keyword.includes(search))) {
          return 1;
        }
        return 0;
      }}
    >
      <CommandInput
        placeholder="Search for agency name"
        className={cn('border border-gray-300 rounded-md', {
          'h-8': inputSize === 'sm',
          'h-10': inputSize === 'md',
        })}
      />
      <CommandList>
        <CommandEmpty>No agencies were found</CommandEmpty>
        <CommandGroup>
          <CommandItem
            onSelect={() => onItemClick(null)}
            className="cursor-pointer"
          >
            Unassigned
          </CommandItem>
          {agencies.map(agency => (
            <CommandItem
              key={agency.id}
              onSelect={() => onItemClick(agency)}
              className="cursor-pointer"
              value={agency.id.toString()}
              keywords={[
                agency.acronym.toLocaleLowerCase(),
                agency.name.toLocaleLowerCase(),
                agency.name_ms.toLocaleLowerCase(),
              ]}
            >
              <span className="font-medium mr-2 text-sm">{agency.acronym}</span>
              <span className="text-dim-500 text-xs truncate w-0 flex-1">
                {agency.name}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
