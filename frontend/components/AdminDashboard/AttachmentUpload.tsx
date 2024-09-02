import React from 'react';
import Close from '@/icons/close';
import { Button } from '../ui/button';
import { StyledDisplay } from '../ui/display';
import GetFileIcon from './GetFileIcon'; // Import the factorized component

interface UploadItem {
  file: File | null; // will be null if it has been uploaded or from database. Will only have value if it is in draft (not yet uploaded) stage
  fileName: string;
  fileSize: number;
  isUploaded: boolean; // will be true if it exists in s3. If it is not yet uploaded, the value will be false
}

interface AttachmentUploadProps {
  attachments: UploadItem[];
  handleRemoveAttachment: (index: string) => void;
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
            <GetFileIcon fileName={file.fileName} />
          </div>
          <div>
            <div className="text-black-900 text-sm font-normal w-[94px]">
              {file.fileName.length > 10
                ? `${file.fileName.substring(0, 9)}...`
                : file.fileName}
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
