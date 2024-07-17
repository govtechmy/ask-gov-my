'use client';

import Pdf from '@/icons/pdf';

interface Props {
  attachments: string[];
}

const SupportingAttachment = ({ attachments }: Props) => {
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

  return (
    <div className="flex flex-wrap gap-2 overflow-auto">
      {attachments.map((attachment, index) => {
        const fileName = getLastSegment(attachment);
        const originalUrl = attachments[index];

        // Determine the icon based on the file type
        let icon;
        if (fileName.endsWith('.png')) {
          icon = 'png';
        } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
          icon = 'jpeg';
        } else if (fileName.endsWith('.pdf')) {
          icon = <Pdf />;
        } else {
          return null;
        }

        return (
          <div
            key={index}
            className="flex-shrink-0 w-[200px] h-[54px] bg-white border border-outline-200 rounded-lg flex items-center hover:cursor-pointer"
            onClick={() => downloadFile(originalUrl, fileName)}
          >
            <div className="p-2">{icon}</div>
            <div className="flex-1">
              <div className="font-normal text-sm text-black-900 truncate w-[140px]">
                {fileName}
              </div>
              <div className="font-normal text-sm text-dim-500">filesize</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SupportingAttachment;
