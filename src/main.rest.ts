import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/index.js';
import { ConfigInterface, RestConfig, RestSchema } from './shared/libs/config/index.js';
import {Component} from './shared/index.js';
import {LoggerInterface} from './shared/libs/logger/models/index.js';
import {PinoLogger} from './shared/libs/logger/index.js';

async function bootstrap(): Promise<void> {
  const container: Container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<LoggerInterface>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  const application: RestApplication = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
