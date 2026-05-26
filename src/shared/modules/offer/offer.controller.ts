import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController, DocumentExistsMiddleware,
  DocumentOwnerMiddleware, HttpError, HttpMethod, HttpRequest,
  PrivateRouteMiddleware,
  RequestQueryInterface,
  ValidateDtoMiddleware, ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { OfferIdRequestParam } from './models/index.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CityRequestParam } from './models/index.js';
import {Component} from '../../models/index.js';
import {LoggerInterface} from '../../libs/logger/models/index.js';
import {OfferServiceInterface} from './models/index.js';
import {
  CommentRdo,
  CommentServiceInterface,
  CreateCommentDto
} from '../comment/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: LoggerInterface,
    @inject(Component.OfferService) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentService) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController...');
    this.addRoutes([
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
        middlewares: [
          new ValidateObjectIdMiddleware('offerId'),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
        ]
      },
      {
        path: '/:offerId',
        method: HttpMethod.Patch,
        handler: this.update,
        middlewares: [
          new PrivateRouteMiddleware(),
          new ValidateObjectIdMiddleware('offerId'),
          new ValidateDtoMiddleware(UpdateOfferDto),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
          new DocumentOwnerMiddleware(this.offerService, 'Offer', 'offerId')
        ]
      },
      {
        path: '/:offerId',
        method: HttpMethod.Delete,
        handler: this.delete,
        middlewares: [
          new PrivateRouteMiddleware(),
          new ValidateObjectIdMiddleware('offerId'),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
          new DocumentOwnerMiddleware(this.offerService, 'Offer', 'offerId')
        ]
      },
      {
        path: '/:offerId/favorite',
        method: HttpMethod.Post,
        handler: this.makeFavorite,
        middlewares: [
          new PrivateRouteMiddleware(),
          new ValidateObjectIdMiddleware('offerId'),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
        ]
      },
      {
        path: '/:offerId/favorite',
        method: HttpMethod.Delete,
        handler: this.removeFavorite,
        middlewares: [
          new PrivateRouteMiddleware(),
          new ValidateObjectIdMiddleware('offerId'),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
        ]
      },
      {
        path: '/:offerId/comments',
        method: HttpMethod.Get,
        handler: this.indexComments,
        middlewares: [
          new ValidateObjectIdMiddleware('offerId'),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
        ]
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
    ]);
  }

  public async index(
    { query, tokenPayload }: Request<unknown, unknown, unknown, RequestQueryInterface>,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.find(query.limit, tokenPayload?.id);
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
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    const offer = await this.offerService.findById(offerId, tokenPayload?.id);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { body, params, tokenPayload }: Request<OfferIdRequestParam, unknown, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    const updatedOffer = await this.offerService.updateById(offerId, { ...body, authorId: tokenPayload.id });

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, void 0);
  }

  public async indexPremium(
    { params, tokenPayload }: Request<CityRequestParam>,
    res: Response
  ): Promise<void> {
    const validCities = [
      'Paris',
      'Cologne',
      'Brussels',
      'Amsterdam',
      'Hamburg',
      'Dusseldorf'
    ];

    const city = Array.isArray(params.city)
      ? params.city[0]
      : params.city;

    if (!validCities.includes(city)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'City must be in Paris | Cologne | Brussels | Amsterdam | Hamburg | Dusseldorf',
        'OfferController'
      );
    }

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
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    await this.offerService.addToFavorite(offerId, tokenPayload.id);
    this.created(res, void 0);
  }

  public async removeFavorite(
    { params, tokenPayload }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    await this.offerService.removeFromFavorite(offerId, tokenPayload.id);
    this.noContent(res, void 0);
  }

  public async indexComments(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async createComment(
    { body, params, tokenPayload }: Request<OfferIdRequestParam, unknown, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    const comment = await this.commentService.create(offerId, { ...body, authorId: tokenPayload.id });
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
