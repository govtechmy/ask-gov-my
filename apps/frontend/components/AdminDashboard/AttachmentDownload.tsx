'use client';
import React from 'react';
import Close from '@/icons/close';
import { Button } from '../ui/button';
import { StyledDisplay } from '../ui/display';
import GetFileIcon from './GetFileIcon';
import { downloadFile, getLastSegment, formatFileSize } from '@/actions/utils';

interface AttachmentDownloadProps {
  uploadedAttachments: string[];
  fileSizes?: number[];
  handleRemoveUploadedAttachment?: (index: number) => void;
}

const AttachmentDownload: React.FC<AttachmentDownloadProps> = ({
  uploadedAttachments,
  fileSizes = [],
  handleRemoveUploadedAttachment,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {uploadedAttachments.map((url, index) => {
        const fileName = getLastSegment(url);
        const size = fileSizes[index];

        return (
          <StyledDisplay
            variant={'uploadDownload'}
            key={index}
            onClick={() => downloadFile(url, fileName)}
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
              <div className="text-dim-500 font-normal text-sm">
                {formatFileSize(size)}
              </div>
            </div>
            {handleRemoveUploadedAttachment && (
              <Button
                variant="cancel-box-red"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveUploadedAttachment(index);
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
