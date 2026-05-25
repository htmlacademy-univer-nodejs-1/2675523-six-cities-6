import {IsEmail, IsString} from 'class-validator';
import {UserValidationMessage} from './user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: UserValidationMessage.email.invalid })
  public email!: string;

  @IsString({ message: UserValidationMessage.password.invalid })
  public password!: string;
}
