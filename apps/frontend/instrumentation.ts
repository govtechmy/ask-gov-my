const requiredEnvVars = [
  "API_URL",
  "AUTH_BASE_URL",
  "AWS_REGION",
  "STORAGE_BUCKET",
  "STORAGE_BASE_URL",
];

export function register() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars ${missing.join(", ")}`);
  }
}
