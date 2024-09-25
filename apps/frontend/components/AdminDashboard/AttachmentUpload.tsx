import React from 'react';
import Close from '@/icons/close';
import { Button } from '../ui/button';
import { StyledDisplay } from '../ui/display';
import GetFileIcon from './GetFileIcon'; // Import the factorized component

interface AttachmentUploadProps {
  attachments: File[];
  handleRemoveAttachment: (index: number) => void;
}

const AttachmentUpload: React.FC<AttachmentUploadProps> = ({
  attachments,
  handleRemoveAttachment,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((file, index) => (
        <StyledDisplay
          variant={'uploadDownload'}
          key={index}
          className="w-[195px]"
        >
          <div className="flex-shrink-0">
            <GetFileIcon fileName={file.name} />
          </div>
          <div>
            <div className="text-black-900 text-sm font-normal truncate w-[94px]">
              {file.name}
            </div>
            <div className="text-dim-500 font-normal text-sm">size 1.2mb</div>
          </div>
          <Button
            variant={'cancel-box-red'}
            onClick={e => {
              e.stopPropagation();
              handleRemoveAttachment(index);
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
