import { OfferPreviewDtoType } from './offer-preview-dto.type.js';

export type OfferFullDtoType = OfferPreviewDtoType & {
  description: string;
  housingImages: string[];
  roomsCount: number;
  guestsCount: number;
  amenities: string[];
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    type: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
};
