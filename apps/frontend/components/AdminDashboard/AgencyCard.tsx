'use client';

import React, { useState } from 'react';
import AgencySettingsModal from './AgencySettingsModal';
import AgencyLogoImporter from '../common/AgencyLogoImporter';
import Gear from '@/icons/gear';
import Toast from '../ui/toast';
import TickCheckCircle from '@/icons/tickcheckcircle';
import AlarmTriangle from '@/icons/alarmtriangle';

interface AgencyCardProps {
  id: number;
  name: string;
  name_ms: string;
  acronym: string;
  logo_url?: string;
  last_edited: string;
  onUpdate: () => void;
}

const AgencyCard: React.FC<AgencyCardProps> = ({
  id,
  name,
  name_ms,
  acronym,
  logo_url,
  last_edited,
  onUpdate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEditAgencyToast, setShowEditAgencyToast] = useState(false);
  const [showFailEditAgencyToast, setShowFailEditAgencyToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleEditAgencyToast = () => {
    setShowEditAgencyToast(true);
  };

  const handleFailEditAgencyToast = () => {
    setShowFailEditAgencyToast(true);
  };

  const handleErrorToast = () => {
    setShowErrorToast(true);
  };

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

      <AgencySettingsModal
        agency={{
          id,
          name,
          name_ms,
          acronym,
          logo_url,
          last_edited,
        }}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          onUpdate();
        }}
        handleEditAgencyToast={handleEditAgencyToast}
        handleErrorToast={handleErrorToast}
        handleFailEditAgencyToast={handleFailEditAgencyToast}
      />

      {showEditAgencyToast && (
        <Toast
          message="Agency have been Edited!"
          icon={<TickCheckCircle />}
          underlineColor="bg-success-600"
          messageColor="text-success-700"
          show={showEditAgencyToast}
          onClose={() => setShowEditAgencyToast(false)}
        />
      )}
      {showFailEditAgencyToast && (
        <Toast
          message="Failed to save. Please try again"
          icon={<AlarmTriangle />}
          underlineColor="bg-danger-600"
          messageColor="text-danger-600"
          show={showFailEditAgencyToast}
          onClose={() => setShowFailEditAgencyToast(false)}
          time={8000}
        />
      )}
      {showErrorToast && (
        <Toast
          message="Unexpected Error Occured. Please Refresh Page."
          icon={<AlarmTriangle />}
          underlineColor="bg-danger-600"
          messageColor="text-danger-600"
          show={showErrorToast}
          onClose={() => setShowErrorToast(false)}
          time={8000}
        />
      )}
    </>
  );
};

export default AgencyCard;
