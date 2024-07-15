'use client';

import React, { useState } from 'react';
import Info from '@/icons/info';
import InputNavbar from '../ui/inputnavbar';
import { useSearchParams } from 'next/navigation';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import Link from 'next/link';
import RightArrow from '@/icons/rightarrow';
import { useTranslations } from 'next-intl';


interface SearchNavbarAgencyProps {
  agencyAcronym: string;
  agencyUUID:string
}

const SearchNavbarAgency: React.FC<SearchNavbarAgencyProps> = ({ agencyAcronym, agencyUUID }) => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [displayAllMatches, setDisplayAllMatches] = useState<boolean>(false);
  const searchparams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(
    searchparams.get('q') || '',
  );
  const t = useTranslations("Agency")
  console.log(agencyAcronym)
  return (
    <div className="py-2 h-56 flex flex-col items-start">
      <div className="flex items-center justify-center h-56">
        <div className="w-full">
          <div className="">
            <div className="flex items-center gap-1">
              <Link href={'/'}>
                <div className="font-medium text-dim-500 text-sm">Home</div>
              </Link>
              <div>
                <RightArrow className="stroke-[#A1A1AA]" />
              </div>
              <div className="font-medium text-black-800 text-sm">{agencyAcronym.toUpperCase()}</div>
            </div>
          </div>
          <div className="flex items-center pb-6 pt-3 text-2xl text-left">
            <div className="h-[42px] w-[42px] flex-shrink-0 flex items-center justify-center">
              <JataNegaraIcon />
            </div>
            <div className="font-poppins text-black-900 font-semibold text-2xl px-3">
            {t(agencyAcronym.toUpperCase())}
            </div>
          </div>

          <div className=" w-full">
            <InputNavbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              displayAllMatches={displayAllMatches}
              setDisplayAllMatches={setDisplayAllMatches}
              agencyUUID={agencyUUID}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchNavbarAgency;
