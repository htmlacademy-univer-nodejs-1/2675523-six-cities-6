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
    @inject(Component.Logger) private readonly logger: LoggerInterface,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.Config) private readonly config: ConfigInterface<RestSchema>
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    this.logger.info(`Token created for ${user.email}`);

    return new SignJWT(this.createTokenPayload(user))
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(this.createSecretKey());
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    this.ensureUserExists(user, dto.email);
    this.ensurePasswordCorrect(user, dto.password, dto.email);

    return user;
  }

  private createTokenPayload(user: UserEntity): TokenPayloadInterface {
    return {
      id: user.id,
      name: user.name,
      type: user.type
    };
  }

  private createSecretKey(): ReturnType<typeof createSecretKey> {
    return createSecretKey(this.config.get('JWT_SECRET'), 'utf-8');
  }

  private ensureUserExists(user: UserEntity | null, email: string): asserts user is UserEntity {
    if (user) {
      return;
    }

    this.logger.warn(`User with email: ${email} not found`);
    throw new UserNotFoundException();
  }

  private ensurePasswordCorrect(user: UserEntity, password: string, email: string): void {
    if (user.verifyPassword(password, this.config.get('SALT'))) {
      return;
    }

    this.logger.warn(`Incorrect password for ${email}`);
    throw new UserPasswordIncorrectException();
  }
}
