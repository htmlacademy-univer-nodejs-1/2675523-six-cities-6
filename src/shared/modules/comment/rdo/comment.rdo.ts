import { Expose } from 'class-transformer';
import { UserRdo } from '../../user/index.js';

export class CommentRdo {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public publishDate!: Date;

  @Expose()
  public rating!: number;

  @Expose()
  public author!: UserRdo;
}
