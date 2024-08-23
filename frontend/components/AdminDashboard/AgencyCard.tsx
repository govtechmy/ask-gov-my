'use client';

import React, { useState } from 'react';
import AgencySettingsModal from './AgencySettingsModal';
import AgencyLogoImporter from '../common/AgencyLogoImporter';
import Gear from '@/icons/gear';

interface AgencyCardProps {
  id: number;
  name: string;
  name_ms: string;
  acronym: string;
  logo_url?: string;
  onUpdate: () => void;
}

const AgencyCard: React.FC<AgencyCardProps> = ({
  id,
  name,
  name_ms,
  acronym,
  logo_url,
  onUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="h-[64px] min-w-[328px] bg-white items-center rounded-md border p-4 shadow-sm flex cursor-pointer group relative"
        onClick={() => setIsModalOpen(true)}
      >
        {/* For Logo Importing Design */}
        <div className="relative h-8 w-8 flex-shrink-0">
          <AgencyLogoImporter currentAgency={{}} logo_url={logo_url} />
        </div>

        <div className="pl-2 text-start text-sm font-medium text-black-800 line-clamp-2">
          {name}
        </div>

        <div
          className={`opacity-0 group-hover:opacity-100 h-8 w-8 border-[1px] border-outline-200 bg-white rounded-lg shadow-button
          items-center justify-center absolute flex top-[15px] right-[17px]`}
        >
          <Gear className="stroke-black-700" />
        </div>
      </div>

      {/* TODO fix this last edited*/}
      <AgencySettingsModal
        agency={{
          id,
          name,
          name_ms,
          acronym,
          logo_url,
          last_edited: new Date(),
        }}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          onUpdate();
        }}
      />
    </>
  );
};

export default AgencyCard;
