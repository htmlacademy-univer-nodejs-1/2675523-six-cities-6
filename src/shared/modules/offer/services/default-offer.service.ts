import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDto } from '../dto/create-offer.dto.js';
import { OfferEntity } from '../offer.entity.js';
import {Component} from '../../../models/index.js';
import {LoggerInterface} from '../../../libs/logger/models/index.js';
import {OfferServiceInterface} from '../models/index.js';
import {
  buildFavoritePipeline,
  fullProjection,
  previewProjection,
  statsPipeline
} from '../utils/index.js';
import {PipelineStage, Types} from 'mongoose';
import {
  DEFAULT_OFFER_COUNT,
  PREMIUM_OFFER_COUNT
} from '../constants/offer.constant.js';
import {UpdateOfferDto} from '../dto/update-offer.dto.js';
import {FavoriteEntity} from '../../favorite/index.js';

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

    return this.findCreatedOffer(created._id);
  }

  public async findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    const [offer] = await this.offerModel
      .aggregate(this.createDetailedOfferPipeline(offerId, userId))
      .exec();

    return offer ?? null;
  }

  private async findCreatedOffer(offerId: Types.ObjectId): Promise<DocumentType<OfferEntity>> {
    const [offer] = await this.offerModel
      .aggregate(this.createCreatedOfferPipeline(offerId))
      .exec();

    return offer;
  }

  public async find(count?: number, userId?: string): Promise<Array<DocumentType<OfferEntity>>> {
    const limit = count ?? DEFAULT_OFFER_COUNT;

    return this.offerModel
      .aggregate(this.createOfferListPipeline(limit, userId))
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId }) !== null);
  }

  public async findPremium(city: string, userId?: string): Promise<Array<DocumentType<OfferEntity>>> {
    return this.offerModel
      .aggregate(this.createPremiumOfferPipeline(city, userId))
      .exec();
  }

  public async findFavorite(userId: string): Promise<Array<DocumentType<OfferEntity>>> {
    return this.offerModel
      .aggregate(this.createFavoriteOfferPipeline(userId))
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

  private createDetailedOfferPipeline(offerId: string, userId?: string): PipelineStage[] {
    return [
      this.createOfferIdMatchStage(new Types.ObjectId(offerId)),
      ...statsPipeline,
      ...buildFavoritePipeline(userId),
      fullProjection
    ];
  }

  private createCreatedOfferPipeline(offerId: Types.ObjectId): PipelineStage[] {
    return [
      this.createOfferIdMatchStage(offerId),
      ...statsPipeline,
      fullProjection
    ];
  }

  private createOfferListPipeline(limit: number, userId?: string): PipelineStage[] {
    return [
      ...statsPipeline,
      ...buildFavoritePipeline(userId),
      previewProjection,
      { $sort: { publishDate: -1 } },
      { $limit: limit }
    ];
  }

  private createPremiumOfferPipeline(city: string, userId?: string): PipelineStage[] {
    return [
      { $match: { city, isPremium: true } },
      { $sort: { createdAt: -1 } },
      { $limit: PREMIUM_OFFER_COUNT },
      ...statsPipeline,
      ...buildFavoritePipeline(userId),
      previewProjection,
    ];
  }

  private createFavoriteOfferPipeline(userId: string): PipelineStage[] {
    return [
      ...buildFavoritePipeline(userId),
      { $match: { isFavorite: true } },
      ...statsPipeline,
      previewProjection
    ];
  }

  private createOfferIdMatchStage(offerId: Types.ObjectId): PipelineStage.Match {
    return { $match: { _id: offerId } };
  }
}
