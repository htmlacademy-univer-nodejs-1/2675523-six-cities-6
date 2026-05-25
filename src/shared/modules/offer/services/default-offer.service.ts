import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDto } from '../dto/create-offer.dto.js';
import { OfferEntity } from '../offer.entity.js';
import {Component} from '../../../models/index.js';
import {LoggerInterface} from '../../../libs/logger/models/index.js';
import {OfferServiceInterface} from '../models/index.js';
import {
  fullProjection,
  previewProjection,
  statsPipeline
} from '../utils/offer.util.js';
import {Types} from 'mongoose';
import {
  DEFAULT_OFFER_COUNT,
  PREMIUM_OFFER_COUNT
} from '../constants/offer.constant.js';
import {UpdateOfferDto} from '../dto/update-offer.dto.js';

@injectable()
export class DefaultOfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly _logger: LoggerInterface,
    @inject(Component.OfferModel) private readonly _offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const created = await this._offerModel.create(dto);
    this._logger.info(`New offer created: ${dto.title}`);

    const [offer] = await this._offerModel
      .aggregate([
        { $match: { _id: created._id } },
        ...statsPipeline,
        fullProjection
      ])
      .exec();

    return offer;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const [offer] = await this._offerModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(offerId) } },
        ...statsPipeline,
        fullProjection
      ]);

    return offer ?? null;
  }

  public async find(count?: number): Promise<Array<DocumentType<OfferEntity>>> {
    const limit = count ?? DEFAULT_OFFER_COUNT;

    return this._offerModel
      .aggregate([
        ...statsPipeline,
        previewProjection,
        { $sort: { publishDate: -1 } },
        { $limit: limit }
      ])
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    await this._offerModel.findByIdAndUpdate(offerId, dto).exec();

    return this.findById(offerId);
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this._offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this._offerModel.exists({ _id: documentId }) !== null);
  }

  public async findPremium(city: string): Promise<Array<DocumentType<OfferEntity>>> {
    return this._offerModel
      .aggregate([
        { $match: { city, isPremium: true } },
        ...statsPipeline,
        previewProjection,
        { $limit: PREMIUM_OFFER_COUNT }
      ])
      .exec();
  }

  public async findFavorite(): Promise<Array<DocumentType<OfferEntity>>> {
    return this._offerModel
      .aggregate([
        { $match: { isFavorite: true } },
        ...statsPipeline,
        previewProjection
      ])
      .exec();
  }

  public async addToFavorite(offerId: string): Promise<void> {
    await this._offerModel
      .findByIdAndUpdate(offerId, { isFavorite: true })
      .exec();
  }

  public async removeFromFavorite(offerId: string): Promise<void> {
    await this._offerModel
      .findByIdAndUpdate(offerId, { isFavorite: false })
      .exec();
  }
}
