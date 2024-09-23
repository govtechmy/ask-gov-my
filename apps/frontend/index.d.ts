declare namespace NodeJS {
  export interface ProcessEnv {
    APP_URL: string;
    APP_ENV: string;
    AUTH_TOKEN: string;
    REVALIDATE_TOKEN: string;

    EMAIL_FROM: string;
    EMAIL_HOST: string;
    EMAIL_PORT: number;
    EMAIL_AUTH_USER: string;
    EMAIL_AUTH_PASS: string;
  }
}
