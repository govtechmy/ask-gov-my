import { uploadFile } from '@/actions/fileServices';

interface FileChangeHandlerProps {
  setUploadError: (error: string | null) => void;
  setUploadSuccess: (success: string | null) => void;
  setUploadStatus: (status: 'initial' | 'error' | 'success') => void;
  setLogoUrl: (url: string) => void;
}

export const handleFileChange = async (
  event: React.ChangeEvent<HTMLInputElement>,
  {
    setUploadError,
    setUploadSuccess,
    setUploadStatus,
    setLogoUrl,
  }: FileChangeHandlerProps,
) => {
  const file = event.target.files?.[0];
  if (!file) {
    console.log('No file selected');
    setUploadError('No file selected');
    setUploadStatus('error');
    return;
  }

  // Reset upload state before starting
  setUploadError(null);
  setUploadSuccess(null);
  setUploadStatus('initial');

  // Validate file type and size before proceeding
  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    console.log(`Invalid file type: ${file.type}`);
    setUploadError('Only PNG and JPEG files are allowed');
    setUploadStatus('error');
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    URL.revokeObjectURL(img.src); // Clean up object URL
    console.log(`Image dimensions: ${img.width}x${img.height}`);
    if (img.width > 201 && img.height > 201) {
      console.log('Image too large');
      setUploadError('Upload photo ideally sized not more than 200x200 pixels');
      setUploadStatus('error');
      return;
    }

    try {
      console.log('Attempting to upload file...');
      const url = await uploadFile(file);
      console.log('Upload successful, URL:', url);
      setLogoUrl(url);
      setUploadSuccess('Upload photo success!');
      setUploadStatus('success');
    } catch (err) {
      console.error('Upload failed:', err);
      const errorMessage =
        err instanceof Error
          ? `Upload failed: ${err.message}`
          : 'An unexpected error occurred during the upload';
      setUploadError(errorMessage);
      setUploadStatus('error');
    }
  };

  img.onerror = () => {
    console.error('Failed to load the image');
    setUploadError('Failed to load the image. Please try again.');
    setUploadStatus('error');
  };
};
