import { CreateCommentDto } from '../dto/create-comment.dto.js';
import {CommentDtoInterface} from '../dto/comment-dto.interface.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<CommentDtoInterface>;
  findByOfferId(offerId: string): Promise<CommentDtoInterface[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
