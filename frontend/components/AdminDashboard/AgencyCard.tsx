'use client';

import React, { useState } from 'react';
import AgencySettingsModal from './AgencySettingsModal';
import JataNegaraIcon from '@/icons/jatanegaraicon';

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
        className="bg-white items-center rounded-md border p-4 shadow-sm flex justify-between cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 mr-4">
            {logo_url ? (
              <img
                src={logo_url}
                alt="Agency Logo"
                className="rounded-full"
                onClick={handleLogoClick}
              />
            ) : (
              <JataNegaraIcon
                className="rounded-full"
                onClick={handleLogoClick}
              />
            )}
          </div>
          <div className="text-base font-medium text-black-900">{name}</div>
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
