import { ContainerModule } from 'inversify';
import { RestApplication } from './rest.application.js';
import { PinoLogger } from '../shared/libs/logger/index.js';
import { ConfigInterface, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClientInterface, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import {LoggerInterface} from '../shared/libs/logger/models/index.js';
import {Component} from '../shared/index.js';
import {
  DefaultExceptionFilter,
  ExceptionFilterInterface, HttpErrorExceptionFilter,
  PathTransformer, ValidationExceptionFilter
} from '../shared/libs/rest/index.js';

export function createRestApplicationContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<RestApplication>(Component.RestApplication)
      .to(RestApplication)
      .inSingletonScope();

    bind<LoggerInterface>(Component.Logger)
      .to(PinoLogger)
      .inSingletonScope();

    bind<ConfigInterface<RestSchema>>(Component.Config)
      .to(RestConfig)
      .inSingletonScope();

    bind<DatabaseClientInterface>(Component.DatabaseClient)
      .to(MongoDatabaseClient)
      .inSingletonScope();

    bind<ExceptionFilterInterface>(Component.DefaultExceptionFilter)
      .to(DefaultExceptionFilter)
      .inSingletonScope();

    bind<ExceptionFilterInterface>(Component.ValidationExceptionFilter)
      .to(ValidationExceptionFilter)
      .inSingletonScope();

    bind<ExceptionFilterInterface>(Component.HttpErrorExceptionFilter)
      .to(HttpErrorExceptionFilter)
      .inSingletonScope();

    bind<PathTransformer>(Component.PathTransformer)
      .to(PathTransformer)
      .inSingletonScope();
  });
}
