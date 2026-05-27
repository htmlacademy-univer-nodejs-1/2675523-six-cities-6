import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  HttpRequest, PathTransformer, PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
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
    this.addRoutes([
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
          new ValidateObjectIdMiddleware('userId'),
          new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
          new DocumentExistsMiddleware(this.userService, 'User', 'userId')
        ]
      }
    ]);
  }

  public async create(
    { body }: HttpRequest<CreateUserDto>,
    res: Response
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} already exists`,
        'UserController'
      );
    }

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
    const foundedUser = tokenPayload?.id
      ? await this.userService.findById(tokenPayload.id)
      : null;

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(UserRdo, foundedUser));
  }

  public async uploadAvatar({ params, file, tokenPayload }: Request, res: Response): Promise<void> {
    const userId = Array.isArray(params.userId)
      ? params.userId[0]
      : params.userId;

    if (tokenPayload?.id !== userId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'You can upload avatar only for your own account',
        'UserController'
      );
    }

    const uploadFile = { avatar: file?.filename };
    await this.userService.updateById(userId, uploadFile);
    this.created(res, { filePath: uploadFile.avatar });
  }
}
