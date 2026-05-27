import {inject, injectable} from 'inversify';
import {Component, getFullServerPath, getMongoURI} from '../shared/index.js';
import {LoggerInterface} from '../shared/libs/logger/models/index.js';
import {ConfigInterface, RestSchema} from '../shared/libs/config/index.js';
import {DatabaseClientInterface} from '../shared/libs/database-client/index.js';
import express, { Express } from 'express';
import cors from 'cors';
import {
  ControllerInterface,
  ExceptionFilterInterface, ParseTokenMiddleware,
} from '../shared/libs/rest/index.js';
import {
  STATIC_FILES_ROUTE,
  STATIC_UPLOAD_ROUTE
} from './consts/rest.constant.js';

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: LoggerInterface,
    @inject(Component.Config) private readonly config: ConfigInterface<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClientInterface,
    @inject(Component.UserController) private readonly userController: ControllerInterface,
    @inject(Component.OfferController) private readonly offerController: ControllerInterface,
    @inject(Component.DefaultExceptionFilter) private readonly defaultExceptionFilter: ExceptionFilterInterface,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilterInterface,
    @inject(Component.ValidationExceptionFilter) private readonly validationExceptionFilter: ExceptionFilterInterface,
    @inject(Component.HttpErrorExceptionFilter) private readonly httpErrorExceptionFilter: ExceptionFilterInterface
  ) {
    this.server = express();
  }

  public async init(): Promise<void> {
    this.logger.info('REST application init');

    this.logger.info('Init database...');
    await this.initDb();
    this.logger.info('Database has been inited');
    this.logger.info('Init app-level middleware...');
    await this.initMiddleware();
    this.logger.info('App-level middleware has been inited');

    this.logger.info('Init controllers...');
    await this.initControllers();
    this.logger.info('Controllers have been inited');

    this.logger.info('Init exception filters...');
    await this.initExceptionFilters();
    this.logger.info('Exception filters have been inited');

    this.logger.info('Init server...');
    await this.initServer();
    this.logger.info(`Server started on ${this.getServerPath()}`);
  }

  private async initDb(): Promise<void> {
    const mongoUri: string = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async initMiddleware(): Promise<void> {
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));

    this.server.use(express.json());
    this.server.use(
      STATIC_UPLOAD_ROUTE,
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(
      STATIC_FILES_ROUTE,
      express.static(this.config.get('STATIC_DIRECTORY'))
    );

    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());
  }

  private async initControllers(): Promise<void> {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
  }

  private async initExceptionFilters(): Promise<void> {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpErrorExceptionFilter.catch.bind(this.httpErrorExceptionFilter));
    this.server.use(this.defaultExceptionFilter.catch.bind(this.defaultExceptionFilter));
  }

  private async initServer(): Promise<void> {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private getServerPath(): string {
    return getFullServerPath(
      this.config.get('SERVER_HOST_PROTOCOL'),
      this.config.get('HOST'),
      this.config.get('PORT')
    );
  }
}
