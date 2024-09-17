import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
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
import { StyledDisplay } from '../ui/display';
import { handleFileChange } from '@/actions/fileChangeHandler';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface AgencySettingsModalProps {
  agency: Agency;
  isOpen: boolean;
  onClose: () => void;
  handleEditAgencyToast: () => void;
  handleFailEditAgencyToast: () => void;
  handleErrorToast: () => void;
}

const formSchema = z.object({
  name: z.string().min(1).max(200),
  nameMs: z.string().min(1).max(200),
  acronym: z.string().min(1).max(20),
});
type FormValues = z.infer<typeof formSchema>;

const AgencySettingsModal: React.FC<AgencySettingsModalProps> = ({
  agency,
  isOpen,
  onClose,
  handleEditAgencyToast,
  handleFailEditAgencyToast,
  handleErrorToast,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: agency.name,
      nameMs: agency.name_ms,
      acronym: agency.acronym,
    },
  });

  const [logoUrl, setLogoUrl] = useState(agency.logo_url || '');
  const acronym = form.watch('acronym');

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    'initial' | 'error' | 'success'
  >('initial');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = form.handleSubmit(async (values: FormValues) => {
    const { name, nameMs, acronym } = values;
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
  });

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e, {
      setUploadError,
      setUploadSuccess,
      setUploadStatus,
      setLogoUrl,
    });
  };

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
            <StyledDisplay variant={'logoBackground'}>
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
            </StyledDisplay>

            <StyledDisplay variant={'logoEditor'} onClick={handleDivClick}>
              <Pencil
                className="stroke-white-forcewhite"
                width="12"
                height="12"
              />
            </StyledDisplay>
            <Input
              ref={fileInputRef}
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleFileChangeWrapper}
            />
          </div>
          {uploadStatus === 'error' ? (
            <p className="text-danger-600 text-sm mt-2 mb-6">{uploadError}</p>
          ) : uploadStatus === 'success' ? (
            <p className="text-green-500 text-sm mt-2 mb-6">{uploadSuccess}</p>
          ) : (
            <p className="mt-2 mb-6 text-dim-500 text-sm">
              Upload photo ideally sized not more than 200x200 pixels in PNG or
              JPG format.
            </p>
          )}

          <Form {...form}>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Agency's name (English)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className={`${fieldState.error ? 'border-danger-300' : ''}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameMs"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Agency's name (Malay)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className={`${fieldState.error ? 'border-danger-300' : ''}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="acronym"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Agency's acronym:</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className={`${fieldState.error ? 'border-danger-300' : ''}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col">
                  <Label>Agency logo preview</Label>
                  <StyledDisplay variant={'nameLogoDisplay'}>
                    <Asklogo />
                    <div className="pl-[10px]">
                      Ask
                      <span className="text-askmygovtextbrand-600">
                        {acronym}
                      </span>
                    </div>
                  </StyledDisplay>
                </div>
              </div>
              <DialogFooter className="p-6 flex justify-end space-x-4">
                <Button type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save settings
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default AgencySettingsModal;
