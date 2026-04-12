import {UserType} from '../../../models/index.js';

export class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatar?: string;
  public type!: UserType;
  public password!: string;
}
