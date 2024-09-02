'use client';
import React from 'react';
import Close from '@/icons/close';
import { Button } from '../ui/button';
import { StyledDisplay } from '../ui/display';
import GetFileIcon from './GetFileIcon';
import { downloadFile, getLastSegment, formatFileSize } from '@/actions/utils';

interface AttachmentDownloadProps {
  attachments: UploadItem[];
  handleRemoveUploadedAttachment?: (index: string) => void;
}

interface UploadItem {
  file: File | null; // will be null if it has been uploaded or from database. Will only have value if it is in draft (not yet uploaded) stage
  fileName: string;
  fileSize: number;
  isUploaded: boolean; // will be true if it exists in s3. If it is not yet uploaded, the value will be false
}

const AttachmentDownload: React.FC<AttachmentDownloadProps> = ({
  attachments,
  handleRemoveUploadedAttachment,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((file, index) => {
        const fileName = file.fileName;
        const size = file.fileSize;

        return (
          <StyledDisplay
            variant={'uploadDownload'}
            key={index}
            onClick={() => downloadFile(fileName)}
          >
            <div className="flex-shrink-0">
              <GetFileIcon fileName={fileName} />
            </div>
            <div>
              <div
                className={`text-black-900 text-sm font-normal truncate ${
                  handleRemoveUploadedAttachment ? 'w-[94px]' : 'w-[138px]'
                }`}
              >
                {fileName}
              </div>
              <div className="text-dim-500 font-normal text-sm">{`${size} MB`}</div>
            </div>
            {handleRemoveUploadedAttachment && (
              <Button
                variant="cancel-box-red"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveUploadedAttachment(fileName);
                }}
              >
                <div className="flex-shrink-0">
                  <Close className="stroke-danger-600" />
                </div>
              </Button>
            )}
          </StyledDisplay>
        );
      })}
    </div>
  );
};

export default AttachmentDownload;
