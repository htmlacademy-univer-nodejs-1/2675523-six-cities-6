import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentEntity} from '../comment.entity.js';
import {CreateCommentDto} from '../dto/create-comment.dto.js';
import {Component} from '../../../models/index.js';
import {CommentServiceInterface} from '../models/comment-service.interface.js';
import {DEFAULT_COMMENTS_COUNT} from '../constants/comment.constant.js';

@injectable()
export class DefaultCommentService implements CommentServiceInterface {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(offerId: string, dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    return this.createAndPopulateComment(offerId, dto);
  }

  public async findByOfferId(offerId: string): Promise<Array<DocumentType<CommentEntity>>> {
    return this.commentModel
      .find({offerId})
      .populate('authorId')
      .sort({createdAt: -1})
      .limit(DEFAULT_COMMENTS_COUNT)
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number | null> {
    const result = await this.commentModel
      .deleteMany({ offerId })
      .exec();

    return result.deletedCount;
  }

  private async createAndPopulateComment(
    offerId: string,
    dto: CreateCommentDto
  ): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({ ...dto, offerId });
    await comment.populate('authorId');

    return comment;
  }
}
