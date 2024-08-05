import React from 'react';
import ImagePngNJpg from '@/icons/imagepngnjpg';
import Pdf from '@/icons/pdf';
import Close from '@/icons/close';

interface AttachmentUploadProps {
  attachments: File[];
  uploadedAttachments: string[];
  handleRemoveAttachment: (index: number) => void;
  handleRemoveUploadedAttachment: (index: number) => void;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <ImagePngNJpg />;
    case 'pdf':
      return <Pdf />;
    default:
      return <div className="bg-red-700">LOGOO</div>;
  }
};

const SupportingAttachmentUpload: React.FC<AttachmentUploadProps> = ({
  attachments,
  uploadedAttachments,
  handleRemoveAttachment,
  handleRemoveUploadedAttachment,
}) => {
  return (
    <div className="">
      <div className="border-b-[1px] border-outline-200 mx-4 pb-2">
        <div className="flex flex-wrap">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex flex-shrink-0 items-center border rounded-lg h-[54px] w-[186px] mr-2 mb-2"
            >
              <div className="flex-shrink-0 pl-3 pr-[6px]">
                {getFileIcon(file.name)}
              </div>
              <div>
                <div className="text-black-900 text-sm font-normal truncate w-[95px]">
                  {file.name}
                </div>
                <div className="text-dim-500 text-sm">size 1.2mb</div>
              </div>
              <button onClick={() => handleRemoveAttachment(index)}>
                <div className="h-8 w-8 ml-[6px] rounded-lg items-center justify-center flex hover:bg-[#FEF2F2] hover:dark:bg-[#2B0707]">
                  <Close className="stroke-[#DC2626] dark:stroke-[#FF5959]"></Close>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="m-4 mb-2">
        <div className="text-sm text-dim-500 font-normal pb-3">
          Previously Uploaded
        </div>
        <div className="flex flex-wrap">
          {uploadedAttachments.map((url, index) => (
            <div
              key={index}
              className="flex flex-shrink-0 items-center border rounded-lg h-[54px] w-[186px] mr-2 mb-2"
            >
              <div className="flex-shrink-0 pl-3 pr-[6px]">
                {getFileIcon(url)}
              </div>
              <div>
                <div className="text-black-900 text-sm font-normal truncate w-[95px]">
                  {url.split('/').pop()}
                </div>
                <div className="text-dim-500 text-sm">size 1.2mb</div>
              </div>

              <button onClick={() => handleRemoveUploadedAttachment(index)}>
                <div className="h-8 w-8 ml-[6px] rounded-lg items-center justify-center flex hover:bg-[#FEF2F2] hover:dark:bg-[#2B0707]">
                  <Close className="stroke-[#DC2626] dark:stroke-[#FF5959]"></Close>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportingAttachmentUpload;
