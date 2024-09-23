import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.FILE_AWS_BUCKET_NAME;

let s3Client: S3Client | null = null;

function s3(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({});
  }
  return s3Client;
}

export async function uploadFile(file: File): Promise<string> {
  const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    console.error(`File type not allowed: ${file.type}`);
    throw new Error(`File type not allowed: ${file.type}`);
  }

  const params = {
    Bucket: BUCKET_NAME!,
    Key: `uploads/${Date.now()}-${file.name}`,
    Body: file,
    ContentType: file.type,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3().send(command);
    console.log(`File uploaded successfully: ${params.Key}`);
    return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    } else {
      throw new Error('Failed to upload file: Unknown error');
    }
  }
}
