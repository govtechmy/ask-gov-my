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
    const putPresignedUrl = await getPresignedUrl(fileName);

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

export async function getPresignedUrl(
  fileName: string,
  operation: 'putObject' | 'getObject' = 'putObject',
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
