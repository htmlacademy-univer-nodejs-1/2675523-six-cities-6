import { UserDtoInterface } from '../../user/index.js';

export interface CommentDtoInterface {
  id: string;
  text: string;
  publishDate: string;
  rating: number;
  author: UserDtoInterface;
}
