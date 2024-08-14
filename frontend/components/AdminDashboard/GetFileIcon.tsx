import React from 'react';
import ImagePngNJpg from '@/icons/imagepngnjpg';
import Pdf from '@/icons/pdf';

interface GetFileIconProps {
  fileName: string;
}

const GetFileIcon: React.FC<GetFileIconProps> = ({ fileName }) => {
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

export default GetFileIcon;
