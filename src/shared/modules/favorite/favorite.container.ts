import { types } from '@typegoose/typegoose';
import { ContainerModule } from 'inversify';
import {Component} from '../../models/index.js';
import {FavoriteEntity, FavoriteModel} from './favorite.entity.js';

export function createFavoriteContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel)
      .toConstantValue(FavoriteModel);
  });
}
