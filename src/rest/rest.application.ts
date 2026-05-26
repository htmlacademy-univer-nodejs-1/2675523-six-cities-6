import {inject, injectable} from 'inversify';
import {Component, getMongoURI} from '../shared/index.js';
import {LoggerInterface} from '../shared/libs/logger/models/index.js';
import {ConfigInterface, RestSchema} from '../shared/libs/config/index.js';
import {DatabaseClientInterface} from '../shared/libs/database-client/index.js';
import express, { Express } from 'express';
import {
  ControllerInterface,
  ExceptionFilterInterface
} from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly _logger: LoggerInterface,
    @inject(Component.Config) private readonly _config: ConfigInterface<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClientInterface,
    @inject(Component.UserController) private readonly userController: ControllerInterface,
    @inject(Component.OfferController) private readonly offerController: ControllerInterface,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilterInterface,
  ) {
    this.server = express();
  }

  public async init(): Promise<void> {
    this._logger.info('REST application init');

    this._logger.info('Init database...');
    await this.initDb();
    this._logger.info('Database has been inited');
    this._logger.info('Init app-level middleware...');
    await this.initMiddleware();
    this._logger.info('App-level middleware has been inited');

    this._logger.info('Init controllers...');
    await this.initControllers();
    this._logger.info('Controllers have been inited');

    this._logger.info('Init exception filters...');
    await this.initExceptionFilters();
    this._logger.info('Exception filters have been inited');

    this._logger.info('Init server...');
    await this.initServer();
    this._logger.info(`Server started on http://localhost:${this._config.get('PORT')}`);
  }

  private async initDb(): Promise<void> {
    const mongoUri: string = getMongoURI(
      this._config.get('DB_USER'),
      this._config.get('DB_PASSWORD'),
      this._config.get('DB_HOST'),
      this._config.get('DB_PORT'),
      this._config.get('DB_NAME')
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async initMiddleware(): Promise<void> {
    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this._config.get('UPLOAD_DIRECTORY'))
    );
  }

  private async initControllers(): Promise<void> {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
  }

  private async initExceptionFilters(): Promise<void> {
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  private async initServer(): Promise<void> {
    const port = this._config.get('PORT');
    this.server.listen(port);
  }
}
