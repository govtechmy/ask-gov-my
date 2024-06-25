declare namespace NodeJS {
  export interface ProcessEnv {
    APP_URL: string;
    APP_ENV: string;
    AUTH_TOKEN: string;
    REVALIDATE_TOKEN: string;

    PLANE_API_KEY: string;
    PLANE_WORKSPACE_ID: string;
    PLANE_WEBHOOK_KEY: string;
  }
}
