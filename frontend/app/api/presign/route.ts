import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

if (
  !process.env.FIKRI_S3_REGION ||
  !process.env.FIKRI_ACCESS_KEY_ID ||
  !process.env.FIKRI_SECRET_ACCESS_KEY
) {
  throw new Error('Missing required S3 configuration environment variables');
}

// TODO: change this to the correct s3 key
const client = new S3Client({
  region: process.env.FIKRI_S3_REGION,
  credentials: {
    accessKeyId: process.env.FIKRI_ACCESS_KEY_ID,
    secretAccessKey: process.env.FIKRI_SECRET_ACCESS_KEY,
  },
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const fileName = searchParams.get('fileName');
  const operation =
    (searchParams.get('operation') as 'getObject' | 'putObject' | null) ??
    'putObject';

  if (!fileName) {
    return NextResponse.json(
      {
        error: {
          message: 'File name query parameter is compulsory',
        },
      },
      { status: 400 },
    );
  }

  const file = `uploads/${Date.now()}-${fileName}`;

  try {
    const url = await generatePresignedUrl(file, operation);
    return NextResponse.json({ presignedUrl: url });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return NextResponse.json(
      { error: { message: 'Failed to generate pre-signed URL' } },
      { status: 500 },
    );
  }
}

async function generatePresignedUrl(
  path: string,
  operation: 'getObject' | 'putObject' = 'putObject',
  expires: number = 3600,
): Promise<string> {
  const params = {
    Bucket: process.env.FIKRI_BUCKET,
    Key: path,
  };

  const command =
    operation === 'getObject'
      ? new GetObjectCommand(params)
      : new PutObjectCommand(params);

  const url = await getSignedUrl(client, command, { expiresIn: expires });
  return url;
}
