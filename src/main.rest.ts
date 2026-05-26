import 'reflect-metadata';
import { Container } from 'inversify';
import {createRestApplicationContainer, RestApplication} from './rest/index.js';
import {Component} from './shared/index.js';
import {createUserContainer} from './shared/modules/user/index.js';
import {createOfferContainer} from './shared/modules/offer/index.js';
import {createCommentContainer} from './shared/modules/comment/index.js';
import {createFavoriteContainer} from './shared/modules/favorite/index.js';
import {createAuthContainer} from './shared/modules/auth/index.js';

async function bootstrap(): Promise<void> {
  const appContainer = new Container();
  appContainer.load(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createFavoriteContainer(),
    createAuthContainer()
  );

  const application: RestApplication = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
