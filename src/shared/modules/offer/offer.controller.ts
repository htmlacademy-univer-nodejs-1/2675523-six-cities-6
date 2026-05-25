import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod, HttpRequest } from '../../libs/rest/index.js';
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
import {CommentServiceInterface} from '../comment/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: LoggerInterface,
    @inject(Component.OfferService) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentService) private readonly commentService: CommentServiceInterface
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController...');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.indexFavorite });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.indexPremium });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
    this.addRoute({ path: '/:offerId/favorite', method: HttpMethod.Post, handler: this.makeFavorite });
    this.addRoute({ path: '/:offerId/favorite', method: HttpMethod.Delete, handler: this.removeFavorite });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, fillDTO(OfferPreviewRdo, offers));
  }

  public async create(
    { body }: HttpRequest<CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async show(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { body, params }: Request<OfferIdRequestParam, unknown, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    const updatedOffer = await this.offerService.updateById(offerId, body);
    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found`,
        'OfferController'
      );
    }

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
    { params }: Request<CityRequestParam>,
    res: Response
  ): Promise<void> {
    const city = Array.isArray(params.city)
      ? params.city[0]
      : params.city;
    const premiumOffers = await this.offerService.findPremium(city);
    this.ok(res, fillDTO(OfferPreviewRdo, premiumOffers));
  }

  public async indexFavorite(
    _req: Request,
    res: Response
  ): Promise<void> {
    const favoriteOffers = await this.offerService.findFavorite();
    this.ok(res, fillDTO(OfferPreviewRdo, favoriteOffers));
  }

  public async makeFavorite(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    await this.offerService.addToFavorite(offerId);
    this.created(res, void 0);
  }

  public async removeFavorite(
    { params }: Request<OfferIdRequestParam>,
    res: Response
  ): Promise<void> {
    const offerId = Array.isArray(params.offerId)
      ? params.offerId[0]
      : params.offerId;
    await this.offerService.removeFromFavorite(offerId);
    this.noContent(res, void 0);
  }
}
