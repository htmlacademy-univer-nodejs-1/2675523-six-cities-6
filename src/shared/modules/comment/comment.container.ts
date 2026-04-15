import { ContainerModule } from 'inversify';
import { DefaultCommentService } from './services/default-comment.service.js';
import { types } from '@typegoose/typegoose';
import { CommentEntity, CommentModel } from './comment.entity.js';
import {CommentServiceInterface} from './models/comment-service.interface.js';
import {Component} from '../../models/index.js';

export function createCommentContainer(): ContainerModule {
  return new ContainerModule(({ bind }) => {
    bind<CommentServiceInterface>(Component.CommentService)
      .to(DefaultCommentService);

    bind<types.ModelType<CommentEntity>>(Component.CommentModel)
      .toConstantValue(CommentModel);
  });
}
