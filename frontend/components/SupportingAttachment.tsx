'use client';

import ImagePngNJpg from '@/icons/imagepngnjpg';
import Pdf from '@/icons/pdf';
import { useState, useEffect } from 'react';

interface Props {
  attachments: string[];
}

const SupportingAttachment = ({ attachments }: Props) => {
  const [fileSizes, setFileSizes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchFileSizes = async () => {
      const sizes: Record<string, number> = {};
      for (const attachment of attachments) {
        try {
          const response = await fetch(attachment, { method: 'HEAD' });
          const contentLength = response.headers.get('Content-Length');
          sizes[attachment] = contentLength ? parseInt(contentLength) : 0;
        } catch (error) {
          console.error('Failed to fetch file size', error);
        }
      }
      setFileSizes(sizes);
    };

    fetchFileSizes();
  }, [attachments]);

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
    }
    return `${(size / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="flex flex-wrap gap-2 overflow-auto">
      {attachments.map((attachment, index) => {
        const fileName = getLastSegment(attachment);
        const fileExtension = getFileExtension(fileName);
        const fileSize = fileSizes[attachment] || 0;

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
          <div
            key={index}
            className="flex-shrink-0 w-[200px] h-[54px] bg-white border border-outline-200 rounded-lg flex items-center hover:cursor-pointer"
            onClick={() => downloadFile(attachment, fileName)}
          >
            <div className="p-2">{icon}</div>
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
                {formatFileSize(fileSize)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SupportingAttachment;
