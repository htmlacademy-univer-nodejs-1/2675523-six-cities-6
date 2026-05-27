import { CityLocation } from './const';
import type { CityName, Comment, NewOffer, Offer, Type, User } from './types/types';

type BackendUser = {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  type?: 'default' | 'pro';
};

type BackendOffer = {
  id: string;
  title: string;
  publishDate?: string;
  city: CityName | string;
  previewImage: string;
  isPremium: boolean;
  isFavorite: boolean;
  housingType: Type;
  price: number;
  rating: number;
  commentsCount?: number;
  description?: string;
  housingImages?: string[];
  roomsCount?: number;
  guestsCount?: number;
  amenities?: string[];
  author?: BackendUser;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

type BackendComment = {
  id: string;
  text: string;
  publishDate: string;
  rating: number;
  author: BackendUser;
};

export type BackendNewOffer = {
  title: string;
  description: string;
  city: CityName;
  previewImage: string;
  housingImages: string[];
  isPremium: boolean;
  housingType: Type;
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

const DEFAULT_AVATAR = '/img/avatar.svg';
const GALLERY_SIZE = 6;

const toCityName = (city: string): CityName => (
  city in CityLocation ? city as CityName : 'Paris'
);

export const adaptUser = (user: BackendUser): User => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatar ?? DEFAULT_AVATAR,
  isPro: user.type === 'pro',
});

export const adaptOffer = (offer: BackendOffer): Offer => {
  const cityName = toCityName(offer.city);
  const fallbackLocation = CityLocation[cityName];
  const images = offer.housingImages?.length
    ? offer.housingImages
    : Array.from({ length: GALLERY_SIZE }, () => offer.previewImage);

  return {
    id: offer.id,
    price: offer.price,
    rating: offer.rating,
    title: offer.title,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    city: {
      name: cityName,
      location: fallbackLocation,
    },
    location: offer.coordinates ?? fallbackLocation,
    previewImage: offer.previewImage,
    type: offer.housingType,
    bedrooms: offer.roomsCount ?? 1,
    description: offer.description ?? '',
    goods: offer.amenities ?? [],
    host: offer.author ? adaptUser(offer.author) : {
      name: '',
      email: '',
      avatarUrl: DEFAULT_AVATAR,
      isPro: false,
    },
    images,
    maxAdults: offer.guestsCount ?? 1,
  };
};

export const adaptComment = (comment: BackendComment): Comment => ({
  id: comment.id,
  comment: comment.text,
  date: comment.publishDate,
  rating: comment.rating,
  user: adaptUser(comment.author),
});

export const adaptNewOfferToServer = (offer: NewOffer): BackendNewOffer => ({
  title: offer.title,
  description: offer.description,
  city: offer.city.name,
  previewImage: offer.previewImage,
  housingImages: Array.from({ length: GALLERY_SIZE }, () => offer.previewImage),
  isPremium: offer.isPremium,
  housingType: offer.type,
  roomsCount: offer.bedrooms,
  guestsCount: offer.maxAdults,
  price: offer.price,
  amenities: offer.goods,
  coordinates: offer.location,
});
