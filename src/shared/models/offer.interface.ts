import { UserInterface } from './user.interface.js';
import { CityName } from './city.interface.js';
import { HouseType } from './house.type.js';
import { AmenitiesType } from './amentities.type.js';

export interface CoordinatesInterface {
  latitude: number;
  longitude: number;
}

export interface OfferInterface {
  title: string;
  description: string;
  city: CityName;
  previewImage: string;
  photos: string[];
  isPremium: boolean;
  type: HouseType;
  rooms: number;
  price: number;
  amenities: AmenitiesType[];
  author: UserInterface;
  coordinates: CoordinatesInterface;
  guestsCount: number;
}
