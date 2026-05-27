import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController, DocumentExistsMiddleware,
  DocumentOwnerMiddleware, HttpError, HttpMethod, HttpRequest, PathTransformer,
  PrivateRouteMiddleware,
  RequestQueryInterface,
  RouteInterface,
  ValidateDtoMiddleware, ValidateObjectIdMiddleware,
  getRequestParam
} from '../../libs/rest/index.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { CityRequestParam, OfferIdRequestParam } from './models/index.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import {Component, findCityName} from '../../models/index.js';
import {LoggerInterface} from '../../libs/logger/models/index.js';
import {OfferServiceInterface} from './models/index.js';
import {
  CommentRdo,
  CommentServiceInterface,
  CreateCommentDto
} from '../comment/index.js';

const OFFER_ID_PARAM = 'offerId';
const CITY_PARAM = 'city';
const OFFER_ENTITY_NAME = 'Offer';
const OFFER_CONTROLLER_NAME = 'OfferController';

@injectable()
export class OfferController extends BaseController {
  private static parseOfferCountLimit(limit?: string): number | undefined {
    return limit === undefined
      ? undefined
      : Number(limit);
  }

  constructor(
    @inject(Component.Logger) protected readonly logger: LoggerInterface,
    @inject(Component.OfferService) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentService) private readonly commentService: CommentServiceInterface,
    @inject(Component.PathTransformer) protected readonly pathTransformer: PathTransformer
  ) {
    super(logger, pathTransformer);

    this.logger.info('Registering routes for OfferController...');
    this.addRoutes(this.getRoutes());
  }

  private getRoutes(): RouteInterface[] {
    return [
      { path: '/', method: HttpMethod.Get, handler: this.index },
      {
        path: '/',
        method: HttpMethod.Post,
        handler: this.create,
        middlewares: [
          new PrivateRouteMiddleware(),
          new ValidateDtoMiddleware(CreateOfferDto)
        ]
      },
      {
        path: '/favorite',
        method: HttpMethod.Get,
        handler: this.indexFavorite,
        middlewares: [
          new PrivateRouteMiddleware()
        ]
      },
      { path: '/premium/:city', method: HttpMethod.Get, handler: this.indexPremium },
      {
        path: '/:offerId',
        method: HttpMethod.Get,
        handler: this.show,
        middlewares: this.getOfferExistsMiddlewares()
      },
      {
        path: '/:offerId',
        method: HttpMethod.Patch,
        handler: this.update,
        middlewares: [
          new PrivateRouteMiddleware(),
          new ValidateObjectIdMiddleware(OFFER_ID_PARAM),
          new ValidateDtoMiddleware(UpdateOfferDto),
          new DocumentExistsMiddleware(this.offerService, OFFER_ENTITY_NAME, OFFER_ID_PARAM),
          new DocumentOwnerMiddleware(this.offerService, OFFER_ENTITY_NAME, OFFER_ID_PARAM)
        ]
      },
      {
        path: '/:offerId',
        method: HttpMethod.Delete,
        handler: this.delete,
        middlewares: this.getOwnerProtectedOfferMiddlewares()
      },
      {
        path: '/:offerId/favorite',
        method: HttpMethod.Post,
        handler: this.makeFavorite,
        middlewares: this.getPrivateOfferExistsMiddlewares()
      },
      {
        path: '/:offerId/favorite',
        method: HttpMethod.Delete,
        handler: this.removeFavorite,
        middlewares: this.getPrivateOfferExistsMiddlewares()
      },
      {
        path: '/:offerId/comments',
        method: HttpMethod.Get,
        handler: this.indexComments,
        middlewares: this.getOfferExistsMiddlewares()
      },
      {
        path: '/:offerId/comments',
        method: HttpMethod.Post,
        handler: this.createComment,
        middlewares: [
          new PrivateRouteMiddleware(),
          new ValidateObjectIdMiddleware('offerId'),
          new ValidateDtoMiddleware(CreateCommentDto),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
        ]
      }
    ];
  }

  private getOfferExistsMiddlewares() {
    return [
      new ValidateObjectIdMiddleware(OFFER_ID_PARAM),
      new DocumentExistsMiddleware(this.offerService, OFFER_ENTITY_NAME, OFFER_ID_PARAM)
    ];
  }

  private getPrivateOfferExistsMiddlewares() {
    return [
      new PrivateRouteMiddleware(),
      ...this.getOfferExistsMiddlewares()
    ];
  }

  private getOwnerProtectedOfferMiddlewares() {
    return [
      ...this.getPrivateOfferExistsMiddlewares(),
      new DocumentOwnerMiddleware(this.offerService, OFFER_ENTITY_NAME, OFFER_ID_PARAM)
    ];
  }

  public async index(
    { query, tokenPayload }: Request<unknown, unknown, unknown, RequestQueryInterface>,
    res: Response
  ): Promise<void> {
    const limit = OfferController.parseOfferCountLimit(query.limit);
    this.ensureValidOfferCountLimit(limit);
    const offers = await this.offerService.find(limit, tokenPayload?.id);

    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async create(
    { body, tokenPayload }: HttpRequest<CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.create({ ...body, authorId: tokenPayload.id });
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async show(
    { params, tokenPayload }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = getRequestParam(params, OFFER_ID_PARAM);
    const offer = await this.offerService.findById(offerId, tokenPayload?.id);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { body, params, tokenPayload }: Request<OfferIdRequestParam, unknown, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const offerId = getRequestParam(params, OFFER_ID_PARAM);
    const updatedOffer = await this.offerService.updateById(offerId, { ...body, authorId: tokenPayload.id });

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = getRequestParam(params, OFFER_ID_PARAM);
    await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, void 0);
  }

  public async indexPremium(
    { params, tokenPayload }: Request<CityRequestParam>,
    res: Response
  ): Promise<void> {
    const city = getRequestParam(params, CITY_PARAM);
    this.ensureKnownCity(city);

    const premiumOffers = await this.offerService.findPremium(city, tokenPayload?.id);
    this.ok(res, fillDTO(OfferPreviewRdo, premiumOffers));
  }

  public async indexFavorite(
    { tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const favoriteOffers = await this.offerService.findFavorite(tokenPayload.id);
    this.ok(res, fillDTO(OfferPreviewRdo, favoriteOffers));
  }

  public async makeFavorite(
    { params, tokenPayload}: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = getRequestParam(params, OFFER_ID_PARAM);
    await this.offerService.addToFavorite(offerId, tokenPayload.id);
    this.created(res, void 0);
  }

  public async removeFavorite(
    { params, tokenPayload }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = getRequestParam(params, OFFER_ID_PARAM);
    await this.offerService.removeFromFavorite(offerId, tokenPayload.id);
    this.noContent(res, void 0);
  }

  public async indexComments(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = getRequestParam(params, OFFER_ID_PARAM);
    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async createComment(
    { body, params, tokenPayload }: Request<OfferIdRequestParam, unknown, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const offerId = getRequestParam(params, OFFER_ID_PARAM);
    const comment = await this.commentService.create(offerId, { ...body, authorId: tokenPayload.id });
    this.created(res, fillDTO(CommentRdo, comment));
  }

  private ensureValidOfferCountLimit(limit?: number): void {
    if (limit === undefined || (Number.isInteger(limit) && limit > 0)) {
      return;
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'Limit must be a positive integer',
      OFFER_CONTROLLER_NAME
    );
  }

  private ensureKnownCity(city: string): void {
    if (findCityName(city)) {
      return;
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      'City must be in Paris | Cologne | Brussels | Amsterdam | Hamburg | Dusseldorf',
      OFFER_CONTROLLER_NAME
    );
  }
}
