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
} from '../utils/index.js';
import {Types} from 'mongoose';
import {
  DEFAULT_OFFER_COUNT,
  PREMIUM_OFFER_COUNT
} from '../constants/offer.constant.js';
import {UpdateOfferDto} from '../dto/update-offer.dto.js';
import {FavoriteEntity} from '../../favorite/index.js';
import {buildFavoritePipeline} from '../utils/index.js';

@injectable()
export class DefaultOfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: LoggerInterface,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const created = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    const [offer] = await this.offerModel
      .aggregate([
        { $match: { _id: created._id } },
        ...statsPipeline,
        fullProjection
      ])
      .exec();

    return offer;
  }

  public async findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const [offer] = await this.offerModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(offerId) } },
        ...statsPipeline,
        ...buildFavoritePipeline(userId),
        fullProjection
      ]);

    return offer ?? null;
  }

  public async find(count?: number, userId?: string): Promise<Array<DocumentType<OfferEntity>>> {
    const limit = count ?? DEFAULT_OFFER_COUNT;

    return this.offerModel
      .aggregate([
        ...statsPipeline,
        ...buildFavoritePipeline(userId),
        previewProjection,
        { $sort: { publishDate: -1 } },
        { $limit: limit }
      ])
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    await this.offerModel.findByIdAndUpdate(offerId, dto).exec();

    return this.findById(offerId);
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId }) !== null);
  }

  public async findPremium(city: string, userId?: string): Promise<Array<DocumentType<OfferEntity>>> {
    return this.offerModel
      .aggregate([
        { $match: { city, isPremium: true } },
        { $sort: { createdAt: -1 } },
        { $limit: PREMIUM_OFFER_COUNT },
        ...statsPipeline,
        ...buildFavoritePipeline(userId),
        previewProjection,
      ])
      .exec();
  }

  public async findFavorite(userId: string): Promise<Array<DocumentType<OfferEntity>>> {
    return this.offerModel
      .aggregate([
        ...buildFavoritePipeline(userId),
        { $match: { isFavorite: true } },
        ...statsPipeline,
        previewProjection
      ])
      .exec();
  }

  public async addToFavorite(offerId: string, userId: string): Promise<void> {
    await this.favoriteModel
      .updateOne(
        { userId, offerId },
        { userId, offerId },
        { upsert: true }
      )
      .exec();
  }

  public async removeFromFavorite(offerId: string, userId: string): Promise<void> {
    await this.favoriteModel
      .deleteOne({ userId, offerId })
      .exec();
  }

  public async getOwnerId(documentId: string): Promise<string | null> {
    const offer = await this.offerModel
      .findById(documentId)
      .select('authorId')
      .exec();

    return offer ? offer.authorId.toString() : null;
  }
}
