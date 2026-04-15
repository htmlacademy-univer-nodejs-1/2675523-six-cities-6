import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from '../user.entity.js';
import {UserDtoInterface} from '../dto/user-dto.interface.js';

export const toUserDto = (user: DocumentType<UserEntity>): UserDtoInterface => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  type: user.type,
});
