export interface RestSchema {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  JWT_SECRET: string;
  UPLOAD_DIRECTORY: string;
  STATIC_DIRECTORY: string;
  HOST: string;
  SERVER_HOST_PROTOCOL: 'http' | 'https';
}
