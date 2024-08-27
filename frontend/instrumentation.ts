export function register() {
  const REGION = process.env.AWS_REGION;
  const BUCKET_NAME = process.env.FILE_AWS_BUCKET_NAME;
  const ACCESS_KEY_ID = process.env.FILE_AWS_ACCESS_KEY_ID;
  const SECRET_ACCESS_KEY = process.env.FILE_AWS_SECRET_ACCESS_KEY;
  const elasticsearchURL = process.env.ELASTICSEARCH_URL;
  const elasticsearchApiKey = process.env.ELASTICSEARCH_API_KEY as string;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!REGION) {
    throw new Error('Missing required environment variable: REGION');
  }

  if (!BUCKET_NAME) {
    throw new Error('Missing required environment variable: BUCKET_NAME');
  }

  if (!ACCESS_KEY_ID) {
    throw new Error('Missing required environment variable: ACCESS_KEY_ID');
  }

  if (!SECRET_ACCESS_KEY) {
    throw new Error('Missing required environment variable: SECRET_ACCESS_KEY');
  }

  if (!elasticsearchApiKey || !elasticsearchURL || !openaiApiKey) {
    throw new Error(
      'Missing required environment variables for elastic search or Open Api key',
    );
  }
}
