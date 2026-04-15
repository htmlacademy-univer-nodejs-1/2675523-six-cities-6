import {CreateOfferDto} from '../dto/create-offer.dto.js';
import {UpdateOfferDto} from '../dto/update-offer.dto.js';
import {OfferFullDtoType} from '../dto/offer-full-dto.type.js';
import {OfferPreviewDtoType} from '../dto/offer-preview-dto.type.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<OfferFullDtoType>;
  findById(offerId: string): Promise<OfferFullDtoType | null>;
  find(count?: number): Promise<OfferPreviewDtoType[]>;
  deleteById(offerId: string): Promise<void>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<OfferFullDtoType | null>;
  findPremium(city: string): Promise<OfferPreviewDtoType[]>;
  findFavorite(): Promise<OfferPreviewDtoType[]>;
  addToFavorite(offerId: string): Promise<void>;
  removeFromFavorite(offerId: string): Promise<void>;
  exists(documentId: string): Promise<boolean>;
}
