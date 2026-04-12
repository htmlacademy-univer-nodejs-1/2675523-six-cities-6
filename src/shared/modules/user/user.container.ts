import { ContainerModule } from 'inversify';
import { DefaultUserService } from './services/default-user.service.js';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from './user.entity.js';
import {UserServiceInterface} from './models/user-service.interface.js';
import {Component} from '../../models/index.js';

export function createUserContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<UserServiceInterface>(Component.UserService)
      .to(DefaultUserService)
      .inSingletonScope();

    bind<types.ModelType<UserEntity>>(Component.UserModel)
      .toConstantValue(UserModel);
  });
}
