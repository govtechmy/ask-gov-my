import React from 'react';
import Close from '@/icons/close';
import { Button } from '../ui/button';
import { StyledUploadDownload } from '../ui/uploaddownload';
import GetFileIcon from './GetFileIcon';

interface AttachmentDownloadProps {
  uploadedAttachments: string[];
  handleRemoveUploadedAttachment: (index: number) => void;
}

const AttachmentDownload: React.FC<AttachmentDownloadProps> = ({
  uploadedAttachments,
  handleRemoveUploadedAttachment,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {uploadedAttachments.map((url, index) => (
        <StyledUploadDownload
          type="uploadDownload"
          key={index}
          className="w-[188px]"
        >
          <div className="flex-shrink-0">
            <GetFileIcon fileName={url} />
          </div>
          <div>
            <div className="text-black-900 text-sm font-normal truncate w-[95px]">
              {url.split('/').pop()}
            </div>
            <div className="text-dim-500 font-normal text-sm">size 1.2mb</div>
          </div>
          <Button
            variant="cancel-box-red"
            onClick={e => {
              e.stopPropagation();
              handleRemoveUploadedAttachment(index);
            }}
            className="ml-auto"
          >
            <div className="flex-shrink-0">
              <Close className="stroke-danger-600" />
            </div>
          </Button>
        </StyledUploadDownload>
      ))}
    </div>
  );
};

export default AttachmentDownload;
