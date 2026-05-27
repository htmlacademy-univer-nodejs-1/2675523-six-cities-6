import { inject, injectable } from 'inversify';
import { DatabaseClientInterface } from './models/database-client.interface.js';
import * as Mongoose from 'mongoose';
import { setTimeout } from 'node:timers/promises';
import {LoggerInterface} from '../logger/models/index.js';
import {Component} from '../../models/index.js';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;

@injectable()
export class MongoDatabaseClient implements DatabaseClientInterface {
  private mongoose!: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.Logger) private readonly logger: LoggerInterface,
  ) {
    this.isConnected = false;
  }

  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error('MongoDB client is already connected');
    }

    this.logger.info('Trying to connect to MongoDB...');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Database connection established');

        return;
      } catch (error) {
        attempt++;
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    throw new Error(`Unable to establish database connectioon after ${RETRY_COUNT} attempts`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      throw new Error('Not connected to the database');
    }

    await this.mongoose.disconnect?.();
    this.isConnected = false;
    this.logger.info('Database connection closed');
  }
}
