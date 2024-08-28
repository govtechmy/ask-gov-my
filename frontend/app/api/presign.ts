import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { NextRequest } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

if (
  !process.env.AWS_REGION ||
  !process.env.S3_ACCESS_KEY ||
  !process.env.S3_SECRET_KEY
) {
  throw new Error('Missing required S3 configuration environment variables');
}

// TODO: change this to the correct s3 key
const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const fileName = searchParams.get('fileName');

  if (!fileName) {
    return Response.json(
      {
        error: {
          message: 'File name query parameter is compulsory',
        },
      },
      { status: 400 },
    );
  }

  const file = `uploads/${Date.now()}-${fileName}`;

  const putCommand = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: file,
  });

  const getCommand = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: file,
  });

  const url = await getSignedUrl(client, putCommand, { expiresIn: 60 });
  const getUrl = await getSignedUrl(client, getCommand, { expiresIn: 60 });
  return Response.json({ presignedUrl: url, getUrl });
}
