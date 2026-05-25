import { CreateCommentDto } from '../dto/create-comment.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {CommentEntity} from '../comment.entity.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<Array<DocumentType<CommentEntity>>>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
