import { IsOptional, IsUrl } from 'class-validator';
import { UserValidationMessage } from './user.messages.js';

export class UpdateUserDto {
  @IsOptional()
  @IsUrl({}, { message: UserValidationMessage.avatar.invalid })
  public avatar?: string;
}
