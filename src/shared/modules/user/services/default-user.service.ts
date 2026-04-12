import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UserEntity } from '../user.entity.js';
import { inject } from 'inversify';
import {LoggerInterface} from '../../../libs/logger/models/index.js';
import {Component} from '../../../models/index.js';
import {UserServiceInterface} from '../models/user-service.interface.js';

export class DefaultUserService implements UserServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId).exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);
    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
