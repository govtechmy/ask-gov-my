interface PresignResponse {
  presignedUrl: string;
  error?: {
    message: string;
  };
}

export async function uploadFile(
  file: File,
  fileName: string,
): Promise<boolean> {
  try {
    const putPresignedUrl = await getPresignUrl(fileName, 'PUT');

    const uploadRes = await fetch(putPresignedUrl, {
      method: 'PUT',
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed! status: ${uploadRes.status}`);
    }
    return true;
  } catch (error) {
    return false;
  }
}

export async function getPresignUrl(
  fileName: string,
  operation: 'GET' | 'PUT',
): Promise<string> {
  const res = await fetch(
    `/api/presign?fileName=${fileName}&operation=${operation}`,
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data: PresignResponse = await res.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.presignedUrl;
}

export async function getFileSize(fileName: string) {
  const url = `/api/presign?fileName=${fileName}&action=${'HEAD'}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Number((data.data / 1e6).toFixed(2));
  } catch (error) {
    console.error('Error getting file size:', error);
    throw error;
  }
}
