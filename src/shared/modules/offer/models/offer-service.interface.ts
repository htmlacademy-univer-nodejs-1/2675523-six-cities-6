import {CreateOfferDto} from '../dto/create-offer.dto.js';
import {UpdateOfferDto} from '../dto/update-offer.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from '../offer.entity.js';
import {DocumentExistsInterface} from '../../../libs/rest/index.js';

export interface OfferServiceInterface extends DocumentExistsInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number): Promise<Array<DocumentType<OfferEntity>>>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findPremium(city: string): Promise<Array<DocumentType<OfferEntity>>>;
  findFavorite(): Promise<Array<DocumentType<OfferEntity>>>;
  addToFavorite(offerId: string): Promise<void>;
  removeFromFavorite(offerId: string): Promise<void>;
  exists(documentId: string): Promise<boolean>;
}
