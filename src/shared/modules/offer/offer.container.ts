import { ContainerModule } from 'inversify';
import { OfferServiceInterface } from './models/offer-service.interface.js';
import { DefaultOfferService } from './services/default-offer.service.js';
import { types } from '@typegoose/typegoose';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { Component } from '../../models/index.js';

export function createOfferContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<OfferServiceInterface>(Component.OfferService)
      .to(DefaultOfferService);

    bind<types.ModelType<OfferEntity>>(Component.OfferModel)
      .toConstantValue(OfferModel);
  });
}
