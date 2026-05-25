import { ContainerModule } from 'inversify';
import { OfferServiceInterface } from './models/index.js';
import { DefaultOfferService } from './services/default-offer.service.js';
import { types } from '@typegoose/typegoose';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { Component } from '../../models/index.js';
import { ControllerInterface } from '../../libs/rest/index.js';
import { OfferController } from './offer.controller.js';

export function createOfferContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<OfferServiceInterface>(Component.OfferService)
      .to(DefaultOfferService);

    bind<types.ModelType<OfferEntity>>(Component.OfferModel)
      .toConstantValue(OfferModel);

    bind<ControllerInterface>(Component.OfferController)
      .to(OfferController)
      .inSingletonScope();
  });
}
