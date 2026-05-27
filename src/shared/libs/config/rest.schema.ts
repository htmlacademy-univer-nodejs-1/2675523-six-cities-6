import convict from 'convict';
import validator from 'convict-format-with-validator';
import {RestSchema} from './models/index.js';

convict.addFormats(validator);

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  SALT: {
    doc: 'Salt to hash password',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'IP address of the database server',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_USER: {
    doc: 'Database user name',
    format: String,
    env: 'DB_USER',
    default: null
  },
  DB_PASSWORD: {
    doc: 'Database password',
    format: String,
    env: 'DB_PASSWORD',
    default: null
  },
  DB_PORT: {
    doc: 'Database port',
    format: 'port',
    env: 'DB_PORT',
    default: '27017'
  },
  DB_NAME: {
    doc: 'Database name',
    format: String,
    env: 'DB_NAME',
    default: null
  },
  JWT_SECRET: {
    doc: 'JWT secret',
    format: String,
    env: 'JWT_SECRET',
    default: null
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for uploaded files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: 'upload'
  },
  STATIC_DIRECTORY: {
    doc: 'Directory for static files',
    format: String,
    env: 'STATIC_DIRECTORY',
    default: 'static'
  },
  HOST: {
    doc: 'Server host',
    format: String,
    env: 'HOST',
    default: 'localhost',
  },
  SERVER_HOST_PROTOCOL: {
    doc: 'Server host protocol',
    format: ['http', 'https'],
    env: 'SERVER_HOST_PROTOCOL',
    default: 'http',
  }
});
