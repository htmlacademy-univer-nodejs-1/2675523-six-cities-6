import { inject, injectable } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CreateOfferDto } from '../dto/create-offer.dto.js';
import { OfferEntity } from '../offer.entity.js';
import {Component} from '../../../models/index.js';
import {LoggerInterface} from '../../../libs/logger/models/index.js';
import {OfferServiceInterface} from '../models/offer-service.interface.js';
import {OfferFullDtoType} from '../dto/offer-full-dto.type.js';
import {
  fullProjection,
  previewProjection,
  statsPipeline
} from '../utils/offer.util.js';
import {Types} from 'mongoose';
import {OfferPreviewDtoType} from '../dto/offer-preview-dto.type.js';
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

  public async create(dto: CreateOfferDto): Promise<OfferFullDtoType> {
    const created = await this._offerModel.create(dto);
    this._logger.info(`New offer created: ${dto.title}`);

    const [offer] = await this._offerModel
      .aggregate<OfferFullDtoType>([
        { $match: { _id: created._id } },
        ...statsPipeline,
        fullProjection
      ])
      .exec();

    return offer;
  }

  public async findById(offerId: string): Promise<OfferFullDtoType | null> {
    const [offer] = await this._offerModel
      .aggregate<OfferFullDtoType>([
        { $match: { _id: new Types.ObjectId(offerId) } },
        ...statsPipeline,
        fullProjection
      ]);

    return offer ?? null;
  }

  public async find(count?: number): Promise<OfferPreviewDtoType[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;

    return this._offerModel
      .aggregate<OfferPreviewDtoType>([
        ...statsPipeline,
        previewProjection,
        { $sort: { publishDate: -1 } },
        { $limit: limit }
      ])
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<OfferFullDtoType | null> {
    await this._offerModel.findByIdAndUpdate(offerId, dto).exec();

    return this.findById(offerId);
  }

  public async deleteById(offerId: string): Promise<void> {
    await this._offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this._offerModel.exists({ _id: documentId }) !== null);
  }

  public async findPremium(city: string): Promise<OfferPreviewDtoType[]> {
    return this._offerModel
      .aggregate<OfferPreviewDtoType>([
        { $match: { city, isPremium: true } },
        ...statsPipeline,
        previewProjection,
        { $limit: PREMIUM_OFFER_COUNT }
      ])
      .exec();
  }

  public async findFavorite(): Promise<OfferPreviewDtoType[]> {
    return this._offerModel
      .aggregate<OfferPreviewDtoType>([
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
