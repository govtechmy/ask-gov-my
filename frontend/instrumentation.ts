export function register() {
  const REGION = process.env.AWS_REGION;
  const BUCKET_NAME = process.env.FILE_AWS_BUCKET_NAME;
  const ACCESS_KEY_ID = process.env.FILE_AWS_ACCESS_KEY_ID;
  const SECRET_ACCESS_KEY = process.env.FILE_AWS_SECRET_ACCESS_KEY;
  const elasticsearchURL = process.env.ELASTICSEARCH_URL;
  const elasticsearchApiKey = process.env.ELASTICSEARCH_API_KEY as string;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!REGION || !BUCKET_NAME || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    throw new Error(
      'Missing required environment variables for AWS S3 configuration',
    );
  }

  if (!elasticsearchApiKey || !elasticsearchURL || !openaiApiKey) {
    throw new Error(
      'Missing required environment variables for elastic search or Open Api key',
    );
  }
}
