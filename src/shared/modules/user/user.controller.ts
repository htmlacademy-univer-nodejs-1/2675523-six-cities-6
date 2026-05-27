import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  HttpRequest, PathTransformer, PrivateRouteMiddleware,
  RouteInterface,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
  getRequestParam
} from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';
import { ConfigInterface, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserDto } from './dto/index.js';
import { LoginUserDto } from './dto/index.js';
import {Component} from '../../models/index.js';
import {LoggerInterface} from '../../libs/logger/models/index.js';
import {UserServiceInterface} from './models/user-service.interface.js';
import {LoggerUserRdo} from './rdo/index.js';
import {AuthServiceInterface} from '../auth/index.js';

const USER_ID_PARAM = 'userId';
const USER_ENTITY_NAME = 'User';
const USER_CONTROLLER_NAME = 'UserController';
const AVATAR_FIELD_NAME = 'avatar';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: LoggerInterface,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.Config) private readonly config: ConfigInterface<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthServiceInterface,
    @inject(Component.PathTransformer) protected readonly pathTransformer: PathTransformer,
  ) {
    super(logger, pathTransformer);

    this.logger.info('Registering routes for UserController...');
    this.addRoutes(this.getRoutes());
  }

  private getRoutes(): RouteInterface[] {
    return [
      {
        path: '/register',
        method: HttpMethod.Post,
        handler: this.create,
        middlewares: [
          new PrivateRouteMiddleware(true),
          new ValidateDtoMiddleware(CreateUserDto)
        ]
      },
      {
        path: '/auth/login',
        method: HttpMethod.Post,
        handler: this.login,
        middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
      },
      {
        path: '/auth/status',
        method: HttpMethod.Get,
        handler: this.getStatus,
        middlewares: [
          new PrivateRouteMiddleware()
        ]
      },
      {
        path: '/:userId/avatar',
        method: HttpMethod.Post,
        handler: this.uploadAvatar,
        middlewares: [
          new PrivateRouteMiddleware(),
          new ValidateObjectIdMiddleware(USER_ID_PARAM),
          new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), AVATAR_FIELD_NAME),
          new DocumentExistsMiddleware(this.userService, USER_ENTITY_NAME, USER_ID_PARAM)
        ]
      }
    ];
  }

  public async create(
    { body }: HttpRequest<CreateUserDto>,
    res: Response
  ): Promise<void> {
    await this.ensureEmailAvailable(body.email);
    const result = await this.userService.create(body, this.config.get('SALT'));

    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: HttpRequest<LoginUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);

    return this.ok(res, fillDTO(LoggerUserRdo, { email: user.email, token }));
  }

  public async getStatus(
    { tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const foundedUser = await this.getUserByTokenPayload(tokenPayload?.id);

    this.ok(res, fillDTO(UserRdo, foundedUser));
  }

  public async uploadAvatar({ params, file, tokenPayload }: Request, res: Response): Promise<void> {
    const userId = getRequestParam(params, USER_ID_PARAM);
    this.ensureAvatarOwner(userId, tokenPayload?.id);

    const avatarFile = await this.saveAvatar(userId, file?.filename);
    this.created(res, { filePath: avatarFile.avatar });
  }

  private async ensureEmailAvailable(email: string): Promise<void> {
    const existsUser = await this.userService.findByEmail(email);

    if (!existsUser) {
      return;
    }

    throw new HttpError(
      StatusCodes.CONFLICT,
      `User with email ${email} already exists`,
      USER_CONTROLLER_NAME
    );
  }

  private async getUserByTokenPayload(userId?: string) {
    const foundedUser = userId
      ? await this.userService.findById(userId)
      : null;

    if (foundedUser) {
      return foundedUser;
    }

    throw new HttpError(
      StatusCodes.UNAUTHORIZED,
      'Unauthorized',
      USER_CONTROLLER_NAME
    );
  }

  private ensureAvatarOwner(userId: string, tokenUserId?: string): void {
    if (tokenUserId === userId) {
      return;
    }

    throw new HttpError(
      StatusCodes.FORBIDDEN,
      'You can upload avatar only for your own account',
      USER_CONTROLLER_NAME
    );
  }

  private async saveAvatar(userId: string, filename?: string) {
    const avatarFile = { avatar: filename };
    await this.userService.updateById(userId, avatarFile);

    return avatarFile;
  }
}
