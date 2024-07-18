'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { uploadFile } from '@/actions/fileServices';
import { addAgency } from '@/actions/userServices';
import Modal from './Modal';

interface AddAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const AddAgencyModal: React.FC<AddAgencyModalProps> = ({ isOpen, onClose, onAdd }) => {
  const t = useTranslations('Agency');
  const [name, setName] = useState('');
  const [nameMs, setNameMs] = useState('');
  const [acronym, setAcronym] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        if (img.width !== 200 || img.height !== 200) {
          setError('Image must be 200x200 pixels');
          return;
        }
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
      };
    }
  };

  const handleSubmit = async () => {
    try {
      if (!name || !nameMs || !acronym || !logoUrl) {
        setError('All fields are required');
        return;
      }

      await addAgency(name, nameMs, acronym, logoUrl);
      setSuccess('Agency added successfully');
      setError(null);
      onAdd();
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
        <h2 className="text-xl font-semibold mb-4">Add New Agency</h2>
        <div className="flex items-center mb-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Agency Logo" className="w-20 h-20 rounded-full mr-4" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
              <span className="text-gray-500">Logo</span>
            </div>
          )}
          <label className="cursor-pointer">
            <span className="text-sm text-blue-500">Upload logo</span>
            <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Agency name:</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Agency's acronym:</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={acronym}
            onChange={(e) => setAcronym(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Agency name in Malay:</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={nameMs}
            onChange={(e) => setNameMs(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button className="mr-2 rounded bg-gray-500 px-4 py-2 text-white" onClick={onClose}>
            Cancel
          </button>
          <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={handleSubmit}>
            Add Agency
          </button>
        </div>
        {success && <div className="text-green-500 mt-4">{success}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </Modal>
  );
};

export default AddAgencyModal;
