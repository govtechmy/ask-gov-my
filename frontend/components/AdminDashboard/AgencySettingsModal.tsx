'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { uploadFile } from '@/actions/fileServices';
import { updateAgency } from '@/actions/userServices';
import ImageNext from 'next/image';
import Pencil from '@/icons/pencil';
import Asklogo from '@/icons/asklogo';
import { Agency } from '@/types/types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import { formatDate } from '@/actions/utils';
import {
  handleAgencyAcronymChange,
  handleAgencyNameChange,
  handleAgencyNameChangeMs,
} from '@/actions/userInputValidation';

interface AgencySettingsModalProps {
  agency: Agency;
  isOpen: boolean;
  onClose: () => void;
  handleEditAgencyToast: () => void;
  handleFailEditAgencyToast: () => void;
  handleErrorToast: () => void;
}

const AgencySettingsModal: React.FC<AgencySettingsModalProps> = ({
  agency,
  isOpen,
  onClose,
  handleEditAgencyToast,
  handleFailEditAgencyToast,
  handleErrorToast,
}) => {
  const [name, setName] = useState(agency.name);
  const [nameMs, setNameMs] = useState(agency.name_ms);
  const [acronym, setAcronym] = useState(agency.acronym);
  const [logoUrl, setLogoUrl] = useState(agency.logo_url || '');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameMsError, setNameMsError] = useState<string | null>(null);
  const [acronymError, setAcronymError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    'initial' | 'error' | 'success'
  >('initial');

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        if (img.width > 201 && img.height > 201) {
          setUploadError(
            'Upload photo ideally sized not more than 200x200 pixels',
          );
          setUploadStatus('error');
          return;
        }

        try {
          const url = await uploadFile(file);
          setLogoUrl(url);
          setUploadSuccess('Upload photo success!');
          setUploadStatus('success');
        } catch (err) {
          setUploadError(
            err instanceof Error
              ? `Upload failed: ${err.message}`
              : 'An unexpected error occurred during the upload',
          );
          setUploadStatus('error');
          handleErrorToast();
        }
      };
      img.onerror = () => {
        setUploadError('Failed to load the image');
        setUploadStatus('error');
        handleErrorToast();
      };
    } else {
      setUploadError('No file selected');
      setUploadStatus('error');
      handleErrorToast();
    }
  };

  const handleSubmit = async () => {
    if (nameError || nameMsError || acronymError || uploadError) {
      return;
    }
    if (name === '' || nameMs === '' || acronym === '') {
      handleAgencyNameChange(
        { target: { value: name } } as React.ChangeEvent<HTMLInputElement>,
        setName,
        setNameError,
      );
      handleAgencyNameChangeMs(
        { target: { value: nameMs } } as React.ChangeEvent<HTMLInputElement>,
        setNameMs,
        setNameMsError,
      );
      handleAgencyAcronymChange(
        { target: { value: acronym } } as React.ChangeEvent<HTMLInputElement>,
        setAcronym,
        setAcronymError,
      );
      return;
    }

    try {
      await updateAgency(agency.id, name, nameMs, acronym, logoUrl || '');
      handleEditAgencyToast();
      onClose();
    } catch (err) {
      onClose();
      console.error('Failed to update agency:', err);
      if (err instanceof Error) {
        if (
          err.message.includes('Network error') ||
          err.message.includes('Timeout')
        ) {
          handleErrorToast();
        } else if (
          err.message.includes('Validation failed') ||
          err.message.includes('Invalid input')
        ) {
          handleFailEditAgencyToast();
        } else {
          handleFailEditAgencyToast();
        }
      } else {
        handleErrorToast();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent hideCloseButton className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="p-6 pb-4">Agency Setting</DialogTitle>
            <div className="text-dim-500 text-sm font-normal pt-2 pr-6">
              Last updated on {formatDate(agency.last_edited, 'short')}
            </div>
          </div>
        </DialogHeader>
        <DialogDescription className="p-6 border-y-[1px] border-outline-200">
          <div className="relative w-16 h-16 flex-shrink-0">
            <div className="absolute inset-0 rounded-full border border-outline-200 bg-transparent flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <ImageNext
                  src={logoUrl}
                  width={200}
                  height={200}
                  alt="Agency Logo"
                />
              ) : (
                <ImageNext
                  src="/jata-200-transparent.png"
                  width={200}
                  height={200}
                  alt="JataNegara"
                />
              )}
            </div>
            <Label
              htmlFor="image-upload"
              className="absolute bottom-0 left-12 h-5 w-5 flex items-center justify-center rounded-full bg-askmygovbrand-600 cursor-pointer"
            >
              <Pencil
                className="stroke-white-forcewhite"
                width="12"
                height="12"
              />
            </Label>
            <Input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
          </div>
          {uploadStatus === 'error' ? (
            <div className="text-danger-600 text-sm mt-[6px] mb-6">
              {uploadError}
            </div>
          ) : uploadStatus === 'success' ? (
            <div className="text-green-500 text-sm mt-[6px] mb-6">
              {uploadSuccess}
            </div>
          ) : (
            <div className="mt-[6px] mb-6 text-dim-500 text-sm">
              Upload photo ideally sized not more than 200x200 pixels in PNG or
              JPG format.
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name-en">Agency's name (English)</Label>
              <Input
                id="name-en"
                type="text"
                value={name}
                onChange={e => handleAgencyNameChange(e, setName, setNameError)}
                className={`${nameError ? 'border-danger-300' : ''}`}
              />
            </div>
            {nameError && (
              <div className="text-danger-600 text-sm">{nameError}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name-ms">Agency's name (Malay)</Label>
              <Input
                id="name-ms"
                type="text"
                value={nameMs}
                onChange={e =>
                  handleAgencyNameChangeMs(e, setNameMs, setNameMsError)
                }
                className={`${nameMsError ? 'border-danger-300' : ''}`}
              />
            </div>
            {nameMsError && (
              <div className="text-danger-600 text-sm">{nameMsError}</div>
            )}
            <div className="flex space-x-6">
              <div className="space-y-2">
                <Label htmlFor="acronym">Agency's acronym:</Label>
                <Input
                  id="acronym"
                  type="text"
                  value={acronym}
                  onChange={e =>
                    handleAgencyAcronymChange(e, setAcronym, setAcronymError)
                  }
                  className={`${acronymError ? 'border-danger-300' : ''}`}
                />
              </div>

              <div className="h-[66px] flex flex-col">
                <Label>Agency logo preview</Label>
                <div className="font-poppins text-lg font-semibold flex items-center mt-[6px] h-10">
                  <Asklogo />
                  <div className="pl-[10px]">
                    Ask{' '}
                    <span className="text-askmygovtextbrand-600">
                      {acronym}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {acronymError && (
              <div className="text-danger-600 text-sm">{acronymError}</div>
            )}
          </div>
        </DialogDescription>
        <DialogFooter className="p-6 flex justify-end space-x-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgencySettingsModal;
