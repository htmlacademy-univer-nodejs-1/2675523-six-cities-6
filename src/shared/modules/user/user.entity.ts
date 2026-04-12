import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { createSHA256 } from '../../helpers/index.js';
import {USER_TYPES, UserInterface, UserType} from '../../models/index.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements UserInterface {
  @prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 15
  })
  public name!: string;

  @prop({
    required: true,
    unique: true,
    trim: true
  })
  public email!: string;

  @prop()
  public avatar?: string;

  @prop({
    required: true,
    type: () => String,
    enum: USER_TYPES,
    default: 'default'
  })
  public type!: UserType;

  @prop({
    required: true,
    minlength: 6,
    maxlength: 12
  })
  private _password?: string;

  constructor(userData: UserInterface) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string): void {
    this._password = createSHA256(password, salt);
  }

  public getPassword(): string | undefined {
    return this._password;
  }
}

export const UserModel = getModelForClass(UserEntity);
