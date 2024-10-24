declare namespace NodeJS {
  export interface ProcessEnv {
    APP_URL: string;
    APP_ENV: string;
    API_URL: string;

    AUTH_BASE_URL: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;

    AWS_PROFILE: string;
    AWS_REGION: string;
    STORAGE_BUCKET: string;
    STORAGE_BASE_URL: string;
    NEXT_PUBLIC_STORAGE_BASE_URL: string;
  }
}
