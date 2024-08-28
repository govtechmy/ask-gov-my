export function register() {
  const REGION = process.env.AWS_REGION;
  const BUCKET_NAME = process.env.FILE_AWS_BUCKET_NAME;
  const elasticsearchURL = process.env.ELASTICSEARCH_URL;
  const elasticsearchApiKey = process.env.ELASTICSEARCH_API_KEY as string;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!REGION) {
    throw new Error('Missing required environment variable: REGION');
  }

  if (!BUCKET_NAME) {
    throw new Error('Missing required environment variable: BUCKET_NAME');
  }

  if (!elasticsearchApiKey || !elasticsearchURL || !openaiApiKey) {
    throw new Error(
      'Missing required environment variables for elastic search or Open Api key',
    );
  }
}
