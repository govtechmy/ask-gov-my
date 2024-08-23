'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { uploadFile } from '@/actions/fileServices';
import { addAgency } from '@/actions/userServices';
import ImageNext from 'next/image';
import Pencil from '@/icons/pencil';
import Asklogo from '@/icons/asklogo';
import PlusIcon from '@/icons/plusicon';

interface AddAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const AddAgencyModal: React.FC<AddAgencyModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [nameMs, setNameMs] = useState('');
  const [acronym, setAcronym] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
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

  if (!isOpen) return null;

  return (
    <div className="z-10 fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-70">
      <div className="bg-white rounded-xl shadow-lg w-[600px]">
        <div className="flex border-b-[1px] border-outline-200">
          <div className="text-black-900 font-semibold text-lg leading-[26px] ml-6 mb-[16px] mt-6 mr-3 h-[26px] w-[350px]">
            Add New Agency
          </div>
        </div>
        <div>
          <div className="h-[360px] w-[552px] m-6">
            <div className="mb-6">
              {logoUrl ? (
                <div className="relative">
                  <div className="w-[64px] h-[64px] relative flex-shrink-0">
                    <div className="absolute h-full w-full rounded-full border-[1px] border-outline-200 bg-transparent"></div>
                    <div className="flex items-center justify-center h-full w-full overflow-hidden rounded-full">
                      <ImageNext
                        src={logoUrl}
                        width={200}
                        height={200}
                        alt="Agency Logo"
                      />
                    </div>
                  </div>
                  <label className="cursor-pointer">
                    <div className=" absolute bottom-0 left-[45px] h-5 w-5 rounded-full bg-askmygovbrand-600 items-center justify-center flex">
                      <div className="h-3 w-3 flex items-center justify-center">
                        <Pencil className="stroke-white-forcewhite"></Pencil>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-[64px] h-[64px] relative flex-shrink-0">
                    <div className="absolute h-full w-full rounded-full border-[1px] border-outline-200 bg-washed-100"></div>
                    <div className="flex items-center justify-center h-full w-full overflow-hidden rounded-full"></div>
                  </div>

                  <label className="cursor-pointer">
                    <div className=" absolute bottom-0 left-[45px] h-5 w-5 rounded-full bg-askmygovbrand-600 items-center justify-center flex">
                      <div className="h-3 w-3 flex items-center justify-center">
                        <PlusIcon className="stroke-white-forcewhite"></PlusIcon>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
              <div className="mt-[6px] text-dim-500 text-sm">
                Upload photo ideally sized not more than 200x200 pixels in PNG
                or JPG format.
              </div>
            </div>
            <div className="mb-6">
              <div className="text-black-700 text-sm font-medium mb-[6px] w-[552px] h-5">
                Agency's name (English)
              </div>
              <input
                type="text"
                className="bg-white h-10 w-[552px] border-[1px] border-outline-200 rounded-lg pl-[12px]
                shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46] mb-6
                text-black-900 font-normal text-base"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              <div className="text-black-700 text-sm font-medium mb-[6px] w-[552px] h-5">
                Agency's name (Malay)
              </div>
              <input
                type="text"
                className="bg-white h-10 w-[552px] border-[1px] border-outline-200 rounded-lg pl-[12px]
                shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46] mb-6
                text-black-900 font-normal text-base"
                value={nameMs}
                onChange={e => setNameMs(e.target.value)}
              />

              <div className="flex">
                <div>
                  <div className="text-black-700 text-sm font-medium mb-[6px] w-[264px] h-5">
                    Agency's acronym:
                  </div>
                  <input
                    type="text"
                    className="bg-white h-10 w-[264px] border-[1px] border-outline-200 rounded-lg pl-[12px]
                    shadow-button focus:border-none focus:outline-none focus:shadow-[0_0_0_1px_#B794FF,0_0_0_4px_#DED1FA] focus:dark:shadow-[0_0_0_1px_#4F20B2,0_0_0_4px_#281B46] mb-6
                    text-black-900 font-normal text-base"
                    value={acronym}
                    onChange={e => setAcronym(e.target.value)}
                  />
                </div>
                <div className="h-[66px] w-[264px] ml-6">
                  <div className="text-black-700 text-sm font-medium mb-[6px] w-[264px] h-5">
                    Agency logo preview
                  </div>
                  <div className="font-poppins flex text-lg font-semibold items-center mt-[6px] h-10">
                    <Asklogo />
                    <div className="flex pl-[10px]">
                      Ask
                      <div className="text-[#702FF9] dark:text-[#9E70FF]">
                        {acronym}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="py-6 flex justify-end pr-6 border-t-[1px] border-outline-200">
            <button
              className="mr-3 h-[44px] w-[77px] border-[1px] border-outline-200 shadow-button rounded-lg 
              text-base items-center justify-center flex hover:cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="w-[119px] h-[44px] rounded-lg items-center justify-center flex text-base font-normal  text-white-forcewhite 
             bg-gradient-to-t from-[#702FF9] to-[#B379FF] dark:from-[#702FF9] dark:to-[#B379FF]
              border-[1px] border-[#702FF9] hover:cursor-pointer shadow-button"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
          {success && <div className="text-green-500 mt-4">{success}</div>}
          {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default AddAgencyModal;
