import { CreateUserDto } from '../dto/create-user.dto.js';
import {UserDtoInterface} from '../dto/user-dto.interface.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<UserDtoInterface>;
  findById(userId: string): Promise<UserDtoInterface | null>;
  findByEmail(email: string): Promise<UserDtoInterface | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<UserDtoInterface>;
}
