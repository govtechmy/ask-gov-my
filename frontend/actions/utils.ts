import { fileInfo } from '@/lib/types/uploadFile';
import { getFileSize, getPresignUrl } from '@/lib/uploadUtils';

export async function fetchFileSizes(
  attachments: string[],
): Promise<fileInfo[]> {
  const fileSizes: fileInfo[] = [];

  try {
    await Promise.all(
      attachments.map(async function (attachment) {
        try {
          const fileSize = await getFileSize(attachment);
          fileSizes.push({
            fileName: attachment,
            fileSize,
          });
        } catch (error) {
          fileSizes.push({
            fileName: attachment,
            fileSize: 0,
          });
        }
      }),
    );
    return fileSizes;
  } catch (error) {
    console.error('Error fetching file sizes', error);
    return fileSizes;
  }
}

export async function downloadFile(fileName: string): Promise<void> {
  const url = await getPresignUrl(fileName, 'GET');
  fetch(url)
    .then(function (response) {
      return response.blob();
    })
    .then(function (blob) {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch(function (error) {
      console.error('Download failed', error);
    });
}

export function getLastSegment(url: string): string {
  const segments = url.split('/');
  return segments.pop() || '';
}

export function formatFileSize(size: number | undefined): string {
  if (size === undefined) return 'Unknown size';
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  } else if (size >= 1000000) {
    return `${(size / 1000000).toFixed(2)} MB`;
  } else {
    return `${(size / 1000).toFixed(2)} KB`;
  }
}

export const formatDate = (
  dateString: string,
  format: 'full' | 'short' = 'full',
): string => {
  const date = new Date(dateString);
  if (format === 'short') {
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return dateFormatter.format(date);
  }

  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = dateFormatter.format(date);
  const formattedTime = timeFormatter
    .format(date)
    .replace(/\s/g, '')
    .toUpperCase();

  return `${formattedDate}, ${formattedTime}`;
};

export function generateHexColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
