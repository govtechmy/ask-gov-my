export async function uploadFile(file: File): Promise<boolean> {
  try {
    const putPresignedUrl = await getPresignedUrl(file.name);

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
) {
  const dir = `${fileName}`;
  const res = await fetch(
    `/api/presign?fileName=${dir}&operation=${operation}`,
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.presignedUrl;
}
