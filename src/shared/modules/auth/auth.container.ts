import { ContainerModule } from 'inversify';
import { DefaultAuthService } from './services/default-auth.service.js';
import {ExceptionFilterInterface} from '../../libs/rest/index.js';
import {Component} from '../../models/index.js';
import {AuthServiceInterface} from './models/auth-service.interface.js';
import {AuthExceptionFilter} from './auth.exception-filter.js';

export function createAuthContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<AuthServiceInterface>(Component.AuthService)
      .to(DefaultAuthService)
      .inSingletonScope();

    bind<ExceptionFilterInterface>(Component.AuthExceptionFilter)
      .to(AuthExceptionFilter)
      .inSingletonScope();
  });
}
