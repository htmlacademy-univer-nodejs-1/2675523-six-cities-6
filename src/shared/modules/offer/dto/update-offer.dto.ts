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
  IsOptional,
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

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: OfferValidationMessage.title.invalid })
  @Length(OFFER_TITLE_MIN_LENGTH, OFFER_TITLE_MAX_LENGTH, { message: OfferValidationMessage.title.length })
  public title?: string;

  @IsOptional()
  @IsString({ message: OfferValidationMessage.description.invalid })
  @Length(OFFER_DESCRIPTION_MIN_LENGTH, OFFER_DESCRIPTION_MAX_LENGTH, { message: OfferValidationMessage.description.length })
  public description?: string;

  @IsOptional()
  @IsIn(CITY_NAMES, { message: OfferValidationMessage.city.invalid })
  public city?: CityName;

  @IsOptional()
  @IsUrl({}, { message: OfferValidationMessage.previewImage.invalid })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: OfferValidationMessage.housingImages.isArray })
  @ArrayMinSize(OFFER_IMAGES_COUNT, { message: OfferValidationMessage.housingImages.arraySize })
  @ArrayMaxSize(OFFER_IMAGES_COUNT, { message: OfferValidationMessage.housingImages.arraySize })
  @IsUrl({}, { each: true, message: OfferValidationMessage.housingImages.invalid })
  public housingImages?: string[];

  @IsOptional()
  @IsBoolean({ message: OfferValidationMessage.isPremium.invalid })
  public isPremium?: boolean;

  @IsOptional()
  @IsIn(HOUSE_TYPES, { message: OfferValidationMessage.housingType.invalid })
  public housingType?: HouseType;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.roomsCount.invalid })
  @Min(OFFER_ROOMS_MIN_COUNT, { message: OfferValidationMessage.roomsCount.min })
  @Max(OFFER_ROOMS_MAX_COUNT, { message: OfferValidationMessage.roomsCount.max })
  public roomsCount?: number;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.guestsCount.invalid })
  @Min(OFFER_GUESTS_MIN_COUNT, { message: OfferValidationMessage.guestsCount.min })
  @Max(OFFER_GUESTS_MAX_COUNT, { message: OfferValidationMessage.guestsCount.max })
  public guestsCount?: number;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.price.invalid })
  @Min(OFFER_PRICE_MIN, { message: OfferValidationMessage.price.min })
  @Max(OFFER_PRICE_MAX, { message: OfferValidationMessage.price.max })
  public price?: number;

  @IsOptional()
  @IsArray({ message: OfferValidationMessage.amenities.isArray })
  @ArrayMinSize(OFFER_AMENITIES_MIN_COUNT)
  @IsIn(AMENITY_TYPES, {
    each: true,
    message: OfferValidationMessage.amenities.invalid,
  })
  public amenities?: AmenitiesType[];

  public authorId!: string;

  @IsOptional()
  @IsCoordinates()
  public coordinates?: CoordinatesInterface;
}
