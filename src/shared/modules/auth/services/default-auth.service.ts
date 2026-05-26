import { inject, injectable } from 'inversify';
import { createSecretKey } from 'node:crypto';
import { SignJWT } from 'jose';
import { JWT_ALGORITHM, JWT_EXPIRED } from '../constants/auth.constant.js';
import { UserNotFoundException, UserPasswordIncorrectException } from '../exceptions/index.js';
import {AuthServiceInterface} from '../models/auth-service.interface.js';
import {Component} from '../../../models/index.js';
import {ConfigInterface, RestSchema} from '../../../libs/config/index.js';
import {
  LoginUserDto,
  UserEntity,
  UserServiceInterface
} from '../../user/index.js';
import {LoggerInterface} from '../../../libs/logger/models/index.js';
import { TokenPayloadInterface } from '../models/token-payload.interface.js';

@injectable()
export class DefaultAuthService implements AuthServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly _logger: LoggerInterface,
    @inject(Component.UserService) private readonly _userService: UserServiceInterface,
    @inject(Component.Config) private readonly _config: ConfigInterface<RestSchema>
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this._config.get('JWT_SECRET');
    const secretKey = createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayloadInterface = {
      id: user.id,
      name: user.name,
      type: user.type
    };

    this._logger.info(`Token created for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this._userService.findByEmail(dto.email);
    if (!user) {
      this._logger.warn(`User with email: ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this._config.get('SALT'))) {
      this._logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
