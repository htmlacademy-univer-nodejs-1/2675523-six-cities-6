import {USER_TYPES, UserType} from '../../../models/index.js';
import {
  IsEmail,
  IsIn,
  IsString,
  Length
} from 'class-validator';
import {UserValidationMessage} from './user.messages.js';

export class CreateUserDto {
  @IsString({ message: UserValidationMessage.name.invalid })
  @Length(1, 15, { message: UserValidationMessage.name.length })
  public name!: string;

  @IsEmail({}, { message: UserValidationMessage.email.invalid })
  public email!: string;

  @IsIn(USER_TYPES, { message: UserValidationMessage.type.invalid })
  public type!: UserType;

  @IsString({ message: UserValidationMessage.password.invalid })
  @Length(6, 12, { message: UserValidationMessage.password.length })
  public password!: string;
}
