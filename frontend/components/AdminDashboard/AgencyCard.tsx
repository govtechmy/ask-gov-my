'use client';

import React, { useState } from 'react';
import AgencySettingsModal from './AgencySettingsModal';
import JataNegaraIcon from '@/icons/jatanegaraicon';
import AgencyLogoImporter from '../AgencyLogoImporter';

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

  const handleLogoClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="h-[64px] min-w-[328px] bg-white items-center rounded-md border p-4 shadow-sm flex cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        {/* For Logo Importing Design */}
        <div className="relative h-8 w-8 flex-shrink-0">
          <AgencyLogoImporter currentAgency={{}} logo_url={logo_url} />
        </div>

        <div className="pl-2 text-start text-sm font-medium text-black-800 line-clamp-2">
          {name}
        </div>
      </div>

      <AgencySettingsModal
        agency={{ id, name, name_ms, acronym, logo_url }}
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
