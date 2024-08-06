'use client';

import ImagePngNJpg from '@/icons/imagepngnjpg';
import Pdf from '@/icons/pdf';
import { Button } from './ui/button';

interface Props {
  attachments: string[];
  fileSize: number[];
}

const SupportingAttachment = ({ attachments, fileSize }: Props) => {
  const downloadFile = (url: string, fileName: string) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch(error => console.error('Download failed', error));
  };

  const getLastSegment = (url: string) => {
    const segments = url.split('/');
    return segments.pop() || '';
  };

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop();
  };

  const formatFileSize = (size: number) => {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else if (size >= 1000000) {
      return `${(size / 1000000).toFixed(2)} MB`;
    } else {
      return `${(size / 1000).toFixed(2)} KB`;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((attachment, index) => {
        const fileName = getLastSegment(attachment);
        const fileExtension = getFileExtension(fileName);
        const size = fileSize[index] || 0;

        // Determine the icon based on the file type
        let icon;
        if (fileExtension === 'png' || fileExtension === 'jpg') {
          icon = <ImagePngNJpg />;
        } else if (fileExtension === 'pdf') {
          icon = <Pdf />;
        } else {
          return null;
        }

        return (
          <Button
            key={index}
            variant={'secondary'}
            size={'md'}
            className="w-[200px] h-[54px]"
            onClick={() => downloadFile(attachment, fileName)}
          >
            <div>{icon}</div>
            <div className="flex-1">
              <div className="flex">
                <div className="font-normal text-sm text-black-900 truncate w-[110px]">
                  {fileName}
                </div>
                <div className="font-normal text-sm text-black-900">
                  {fileExtension}
                </div>
              </div>
              <div className="font-normal text-sm text-dim-500">
                {formatFileSize(size)}
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default SupportingAttachment;
