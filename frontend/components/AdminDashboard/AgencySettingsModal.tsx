'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { uploadFile } from '@/actions/fileServices';
import { updateAgency } from '@/actions/userServices';
import Modal from './Modal';

interface Agency {
  id: number;
  name: string;
  name_ms: string;
  acronym: string;
  logo_url: string;
}

interface AgencySettingsModalProps {
  agency: Agency;
  isOpen: boolean;
  onClose: () => void;
}

const AgencySettingsModal: React.FC<AgencySettingsModalProps> = ({
  agency,
  isOpen,
  onClose,
}) => {
  const t = useTranslations('Agency');
  const [name, setName] = useState(agency.name);
  const [nameMs, setNameMs] = useState(agency.name_ms);
  const [acronym, setAcronym] = useState(agency.acronym);
  const [logoUrl, setLogoUrl] = useState(agency.logo_url);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      try {
        const url = await uploadFile(file);
        setLogoUrl(url);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        setSuccess(null);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await updateAgency(agency.id, name, nameMs, acronym, logoUrl);
      setSuccess('Agency updated successfully');
      setError(null);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      setSuccess(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="text-sm text-gray-500 mb-4">
          Last updated on {new Date().toLocaleDateString()}
        </div>
        <h2 className="text-xl font-semibold mb-4">Agency setting</h2>
        <div className="flex items-center mb-4">
          <img
            src={logoUrl || '/default-logo.png'}
            alt="Agency Logo"
            className="w-20 h-20 rounded-full mr-4"
          />
          <label className="cursor-pointer">
            <span className="text-sm text-blue-500">Change logo</span>
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agency name:
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agency's acronym:
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={acronym}
            onChange={e => setAcronym(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agency name in Malay:
          </label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={nameMs}
            onChange={e => setNameMs(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 rounded bg-gray-500 px-4 py-2 text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={handleSubmit}
          >
            Save setting
          </button>
        </div>
        {success && <div className="text-green-500 mt-4">{success}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </Modal>
  );
};

export default AgencySettingsModal;
