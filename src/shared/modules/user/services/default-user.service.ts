import { types } from '@typegoose/typegoose';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { UserEntity } from '../user.entity.js';
import { inject } from 'inversify';
import {LoggerInterface} from '../../../libs/logger/models/index.js';
import {Component} from '../../../models/index.js';
import {UserServiceInterface} from '../models/user-service.interface.js';
import {UserDtoInterface} from '../dto/user-dto.interface.js';
import {toUserDto} from '../utils/user.util.js';

export class DefaultUserService implements UserServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: LoggerInterface,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<UserDtoInterface> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return toUserDto(result);
  }

  public async findByEmail(email: string): Promise<UserDtoInterface | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? toUserDto(user) : null;
  }

  public async findById(userId: string): Promise<UserDtoInterface | null> {
    const user = await this.userModel.findById(userId).exec();
    return user ? toUserDto(user) : null;
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<UserDtoInterface> {
    const existedUser = await this.findByEmail(dto.email);
    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
