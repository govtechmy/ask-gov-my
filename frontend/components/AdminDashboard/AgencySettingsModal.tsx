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
  const [name, setName] = useState(agency.name);
  const [nameMs, setNameMs] = useState(agency.name_ms);
  const [acronym, setAcronym] = useState(agency.acronym);
  const [logoUrl, setLogoUrl] = useState(agency.logo_url || '');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        if (img.width !== 200 || img.height !== 200) {
          setError('Image must be exactly 200x200 pixels');
          return;
        }
        try {
          const url = await uploadFile(file);
          setLogoUrl(url);
          setSuccess('Image uploaded successfully');
        } catch (err) {
          setError(
            err instanceof Error
              ? `Upload failed: ${err.message}`
              : 'An unexpected error occurred during the upload',
          );
        }
      };
      img.onerror = () => setError('Failed to load the image');
    } else {
      setError('No file selected');
    }
  };

  const handleSubmit = async () => {
    try {
      await updateAgency(agency.id, name, nameMs, acronym, logoUrl || '');
      setSuccess('Agency updated successfully');
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? 'Update failed' : 'An unexpected error occurred',
      );
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
          <div className="mt-[6px] mb-6 text-dim-500 text-sm">
            Upload photo ideally sized not more than 200x200 pixels in PNG or
            JPG format.
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name-en">Agency's name (English)</Label>
              <Input
                id="name-en"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-ms">Agency's name (Malay)</Label>
              <Input
                id="name-ms"
                type="text"
                value={nameMs}
                onChange={e => setNameMs(e.target.value)}
              />
            </div>
            <div className="flex space-x-6">
              <div className="space-y-2">
                <Label htmlFor="acronym">Agency's acronym:</Label>
                <Input
                  id="acronym"
                  type="text"
                  value={acronym}
                  onChange={e => setAcronym(e.target.value)}
                />
              </div>
              <div className="h-[66px] w-[264px] flex flex-col">
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
          </div>
        </DialogDescription>
        <DialogFooter className="p-6 flex justify-end space-x-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save settings
          </Button>
        </DialogFooter>
        {success && <div className="text-green-500 mt-4">{success}</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </DialogContent>
    </Dialog>
  );
};

export default AgencySettingsModal;
