import {LoginUserDto, UserEntity} from '../../user/index.js';

export interface AuthServiceInterface {
  authenticate(user: UserEntity): Promise<string>;
  verify(dto: LoginUserDto): Promise<UserEntity>;
}
