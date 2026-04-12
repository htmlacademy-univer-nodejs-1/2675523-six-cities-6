import {
  AmenitiesType, CityInterface,
  CoordinatesInterface,
  HouseType
} from '../../../models/index.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public publishDate!: Date;
  public city!: CityInterface;
  public previewImage!: string;
  public housingImages!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public housingType!: HouseType;
  public roomsCount!: number;
  public guestsCount!: number;
  public price!: number;
  public amenities!: AmenitiesType[];
  public authorId!: string;
  public coordinates!: CoordinatesInterface;
}
