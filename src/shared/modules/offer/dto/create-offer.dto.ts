import {
  AmenitiesType, AMENITY_TYPES, CityName,
  CoordinatesInterface, HOUSE_TYPES,
  HouseType
} from '../../../models/index.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray, IsBoolean,
  IsIn, IsInt,
  IsString,
  IsUrl,
  Length, Max, Min
} from 'class-validator';
import {OfferValidationMessage} from './offer.messages.js';
import {IsCoordinates} from '../../../libs/rest/index.js';

export class CreateOfferDto {
  @IsString({ message: OfferValidationMessage.title.invalid })
  @Length(10, 100, { message: OfferValidationMessage.title.length })
  public title!: string;

  @IsString({ message: OfferValidationMessage.description.invalid })
  @Length(20, 1024, { message: OfferValidationMessage.description.length })
  public description!: string;

  @IsIn([
    'Paris',
    'Cologne',
    'Brussels',
    'Amsterdam',
    'Hamburg',
    'Dusseldorf'
  ], { message: OfferValidationMessage.city.invalid })
  public city!: CityName;

  @IsUrl({}, { message: OfferValidationMessage.previewImage.invalid })
  public previewImage!: string;

  @IsArray({ message: OfferValidationMessage.housingImages.isArray })
  @ArrayMinSize(6, { message: OfferValidationMessage.housingImages.arraySize })
  @ArrayMaxSize(6, { message: OfferValidationMessage.housingImages.arraySize })
  @IsUrl({}, { each: true, message: OfferValidationMessage.housingImages.invalid })
  public housingImages!: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalid })
  public isPremium!: boolean;

  @IsIn(HOUSE_TYPES, { message: OfferValidationMessage.housingType.invalid })
  public housingType!: HouseType;

  @IsInt({ message: OfferValidationMessage.roomsCount.invalid })
  @Min(1, { message: OfferValidationMessage.roomsCount.min })
  @Max(8, { message: OfferValidationMessage.roomsCount.max })
  public roomsCount!: number;

  @IsInt({ message: OfferValidationMessage.guestsCount.invalid })
  @Min(1, { message: OfferValidationMessage.guestsCount.min })
  @Max(10, { message: OfferValidationMessage.guestsCount.max })
  public guestsCount!: number;

  @IsInt({ message: OfferValidationMessage.price.invalid })
  @Min(100, { message: OfferValidationMessage.price.min })
  @Max(100_000, { message: OfferValidationMessage.price.max })
  public price!: number;

  @IsArray({ message: OfferValidationMessage.amenities.isArray })
  @IsIn(AMENITY_TYPES, {
    each: true,
    message: OfferValidationMessage.amenities.invalid,
  })
  public amenities!: AmenitiesType[];

  public authorId!: string;

  @IsCoordinates()
  public coordinates!: CoordinatesInterface;
}
