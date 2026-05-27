import {
  AmenitiesType, AMENITY_TYPES, CITY_NAMES, CityName,
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
import {
  OFFER_AMENITIES_MIN_COUNT,
  OFFER_DESCRIPTION_MAX_LENGTH,
  OFFER_DESCRIPTION_MIN_LENGTH,
  OFFER_GUESTS_MAX_COUNT,
  OFFER_GUESTS_MIN_COUNT,
  OFFER_IMAGES_COUNT,
  OFFER_PRICE_MAX,
  OFFER_PRICE_MIN,
  OFFER_ROOMS_MAX_COUNT,
  OFFER_ROOMS_MIN_COUNT,
  OFFER_TITLE_MAX_LENGTH,
  OFFER_TITLE_MIN_LENGTH
} from '../constants/offer.constant.js';

export class CreateOfferDto {
  @IsString({ message: OfferValidationMessage.title.invalid })
  @Length(OFFER_TITLE_MIN_LENGTH, OFFER_TITLE_MAX_LENGTH, { message: OfferValidationMessage.title.length })
  public title!: string;

  @IsString({ message: OfferValidationMessage.description.invalid })
  @Length(OFFER_DESCRIPTION_MIN_LENGTH, OFFER_DESCRIPTION_MAX_LENGTH, { message: OfferValidationMessage.description.length })
  public description!: string;

  @IsIn(CITY_NAMES, { message: OfferValidationMessage.city.invalid })
  public city!: CityName;

  @IsUrl({}, { message: OfferValidationMessage.previewImage.invalid })
  public previewImage!: string;

  @IsArray({ message: OfferValidationMessage.housingImages.isArray })
  @ArrayMinSize(OFFER_IMAGES_COUNT, { message: OfferValidationMessage.housingImages.arraySize })
  @ArrayMaxSize(OFFER_IMAGES_COUNT, { message: OfferValidationMessage.housingImages.arraySize })
  @IsUrl({}, { each: true, message: OfferValidationMessage.housingImages.invalid })
  public housingImages!: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalid })
  public isPremium!: boolean;

  @IsIn(HOUSE_TYPES, { message: OfferValidationMessage.housingType.invalid })
  public housingType!: HouseType;

  @IsInt({ message: OfferValidationMessage.roomsCount.invalid })
  @Min(OFFER_ROOMS_MIN_COUNT, { message: OfferValidationMessage.roomsCount.min })
  @Max(OFFER_ROOMS_MAX_COUNT, { message: OfferValidationMessage.roomsCount.max })
  public roomsCount!: number;

  @IsInt({ message: OfferValidationMessage.guestsCount.invalid })
  @Min(OFFER_GUESTS_MIN_COUNT, { message: OfferValidationMessage.guestsCount.min })
  @Max(OFFER_GUESTS_MAX_COUNT, { message: OfferValidationMessage.guestsCount.max })
  public guestsCount!: number;

  @IsInt({ message: OfferValidationMessage.price.invalid })
  @Min(OFFER_PRICE_MIN, { message: OfferValidationMessage.price.min })
  @Max(OFFER_PRICE_MAX, { message: OfferValidationMessage.price.max })
  public price!: number;

  @IsArray({ message: OfferValidationMessage.amenities.isArray })
  @ArrayMinSize(OFFER_AMENITIES_MIN_COUNT)
  @IsIn(AMENITY_TYPES, {
    each: true,
    message: OfferValidationMessage.amenities.invalid,
  })
  public amenities!: AmenitiesType[];

  public authorId!: string;

  @IsCoordinates()
  public coordinates!: CoordinatesInterface;
}
