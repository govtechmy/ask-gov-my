import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const REGION = process.env.NEXT_PUBLIC_AWS_REGION;
const BUCKET_NAME = process.env.NEXT_PUBLIC_FILE_AWS_BUCKET_NAME;
const ACCESS_KEY_ID = process.env.NEXT_PUBLIC_FILE_AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_FILE_AWS_SECRET_ACCESS_KEY;

if (!REGION || !BUCKET_NAME || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  throw new Error('Missing required environment variables for AWS S3 configuration');
}

const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID!,
    secretAccessKey: SECRET_ACCESS_KEY!,
  },
});

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
    await s3Client.send(command);
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
