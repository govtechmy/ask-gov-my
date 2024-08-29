import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
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
  const operation =
    (searchParams.get('operation') as 'getObject' | 'putObject' | null) ??
    'putObject';

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
  expires: number = 60,
): Promise<string> {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: path,
  };

  const command =
    operation === 'getObject'
      ? new GetObjectCommand(params)
      : new PutObjectCommand(params);

  return await getSignedUrl(client, command, { expiresIn: expires });
}
