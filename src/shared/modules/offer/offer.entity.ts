import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { CoordinatesSchema } from './coordinates.schema.js';
import {
  AmenitiesType,
  AMENITY_TYPES,
  CITY_NAMES,
  CityName,
  HOUSE_TYPES,
  HouseType
} from '../../models/index.js';
import {
  OFFER_DESCRIPTION_MAX_LENGTH,
  OFFER_DESCRIPTION_MIN_LENGTH,
  OFFER_GUESTS_MAX_COUNT,
  OFFER_GUESTS_MIN_COUNT,
  OFFER_PRICE_MAX,
  OFFER_PRICE_MIN,
  OFFER_ROOMS_MAX_COUNT,
  OFFER_ROOMS_MIN_COUNT,
  OFFER_TITLE_MAX_LENGTH,
  OFFER_TITLE_MIN_LENGTH
} from './constants/offer.constant.js';

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    trim: true,
    minlength: OFFER_TITLE_MIN_LENGTH,
    maxlength: OFFER_TITLE_MAX_LENGTH
  })
  public title!: string;

  @prop({
    required: true,
    trim: true,
    minlength: OFFER_DESCRIPTION_MIN_LENGTH,
    maxlength: OFFER_DESCRIPTION_MAX_LENGTH
  })
  public description!: string;

  @prop({
    required: true,
    type: () => String,
    enum: CITY_NAMES
  })
  public city!: CityName;

  @prop({
    required: true,
    trim: true
  })
  public previewImage!: string;

  @prop({
    required: true,
    type: () => [String]
  })
  public housingImages!: string[];

  @prop({
    required: true,
    default: false
  })
  public isPremium!: boolean;

  @prop({
    required: true,
    type: () => String,
    enum: HOUSE_TYPES
  })
  public housingType!: HouseType;

  @prop({
    required: true,
    min: OFFER_ROOMS_MIN_COUNT,
    max: OFFER_ROOMS_MAX_COUNT
  })
  public roomsCount!: number;

  @prop({
    required: true,
    min: OFFER_GUESTS_MIN_COUNT,
    max: OFFER_GUESTS_MAX_COUNT
  })
  public guestsCount!: number;

  @prop({
    required: true,
    min: OFFER_PRICE_MIN,
    max: OFFER_PRICE_MAX
  })
  public price!: number;

  @prop({
    required: true,
    type: () => [String],
    enum: AMENITY_TYPES
  })
  public amenities!: AmenitiesType[];

  @prop({
    required: true,
    ref: UserEntity
  })
  public authorId!: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentsCount!: number;

  @prop({
    required: true,
    _id: false,
    type: () => CoordinatesSchema
  })
  public coordinates!: CoordinatesSchema;
}

export const OfferModel = getModelForClass(OfferEntity);
