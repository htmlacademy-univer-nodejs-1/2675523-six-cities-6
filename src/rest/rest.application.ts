import {inject, injectable} from 'inversify';
import {Component, getMongoURI} from '../shared/index.js';
import {LoggerInterface} from '../shared/libs/logger/models/index.js';
import {ConfigInterface, RestSchema} from '../shared/libs/config/index.js';
import {DatabaseClientInterface} from '../shared/libs/database-client/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly _logger: LoggerInterface,
    @inject(Component.Config) private readonly _config: ConfigInterface<RestSchema>,
    @inject(Component.DatabaseClient) private readonly _databaseClient: DatabaseClientInterface,
  ) {
  }

  public async init(): Promise<void> {
    this._logger.info('REST application init');
    this._logger.info(`Get value from env $PORT: ${this._config.get('PORT')}`);

    this._logger.info('Init database...');
    await this.initDb();
    this._logger.info('Database has been inited');
  }

  private async initDb(): Promise<void> {
    const mongoUri: string = getMongoURI(
      this._config.get('DB_USER'),
      this._config.get('DB_PASSWORD'),
      this._config.get('DB_HOST'),
      this._config.get('DB_PORT'),
      this._config.get('DB_NAME')
    );

    return this._databaseClient.connect(mongoUri);
  }
}
