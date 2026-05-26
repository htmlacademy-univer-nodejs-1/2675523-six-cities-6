import { CreateUserDto } from '../dto/create-user.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {UserEntity} from '../user.entity.js';
import {DocumentExistsInterface} from '../../../libs/rest/index.js';

export interface UserServiceInterface extends DocumentExistsInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
}
