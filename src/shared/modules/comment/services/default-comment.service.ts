import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentEntity } from '../comment.entity.js';
import { CreateCommentDto } from '../dto/create-comment.dto.js';
import {Component} from '../../../models/index.js';
import {CommentServiceInterface} from '../models/comment-service.interface.js';
import {CommentDtoInterface} from '../dto/comment-dto.interface.js';
import {toCommentDto} from '../utils/comment.util.js';
import {DEFAULT_COMMENTS_COUNT} from '../constants/comment.constant.js';

@injectable()
export class DefaultCommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly _commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<CommentDtoInterface> {
    const comment = await this._commentModel.create(dto);
    await comment.populate('authorId');

    return toCommentDto(comment);
  }

  public async findByOfferId(offerId: string): Promise<CommentDtoInterface[]> {
    const comments = await this._commentModel
      .find({ offerId })
      .populate('authorId')
      .sort({ createdAt: -1 })
      .limit(DEFAULT_COMMENTS_COUNT)
      .exec();

    return comments.map(toCommentDto);
  }

  public async deleteByOfferId(offerId: string): Promise<number | null> {
    const result = await this._commentModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }
}
