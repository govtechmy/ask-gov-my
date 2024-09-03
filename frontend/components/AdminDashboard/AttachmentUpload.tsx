import React from 'react';
import Close from '@/icons/close';
import { Button } from '../ui/button';
import { StyledDisplay } from '../ui/display';
import GetFileIcon from './GetFileIcon'; // Import the factorized component
import { ToUploadItem } from '@/lib/types/uploadFile';

export interface AttachmentUploadProps {
  attachments: ToUploadItem[];
  handleRemoveAttachment: (index: string) => void;
}

const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  attachments,
  handleRemoveAttachment,
}) => {
  let fileName = attachments[0].file.name;
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((file, index) => (
        <StyledDisplay
          variant={'uploadDownload'}
          key={index}
          className="w-[195px]"
        >
          <div className="flex-shrink-0">
            <GetFileIcon fileName={file.file.name} />
          </div>
          <div>
            <div className="text-black-900 text-sm font-normal w-[94px]">
              {file.file.name.length > 10
                ? `${file.file.name.substring(0, 9)}...`
                : file.file.name}
            </div>
            <div className="text-dim-500 font-normal text-sm">
              {`size ${(file.fileSize / 1e6).toFixed(2)} MB`}
            </div>
          </div>
          <Button
            variant={'cancel-box-red'}
            onClick={e => {
              e.stopPropagation();
              handleRemoveAttachment(file.fileName);
            }}
          >
            <Close className="stroke-danger-600" />
          </Button>
        </StyledDisplay>
      ))}
    </div>
  );
};

export default AttachmentUpload;
