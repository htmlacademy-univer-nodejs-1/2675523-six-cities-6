import { IsNumber, IsString, Length, Max, Min} from 'class-validator';
import {CommentValidationMessage} from './comment.messages.js';

export class CreateCommentDto {

  @IsString({ message: CommentValidationMessage.text.invalid })
  @Length(5, 1024, { message: CommentValidationMessage.text.length })
  public text!: string;

  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: CommentValidationMessage.rating.invalid }
  )
  @Min(1, { message: CommentValidationMessage.rating.min })
  @Max(5, { message: CommentValidationMessage.rating.max })
  public rating!: number;

  public authorId!: string;
}
