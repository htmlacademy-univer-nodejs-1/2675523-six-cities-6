import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { CoordinatesSchema } from './coordinates.schema.js';
import {
  AmenitiesType,
  AMENITY_TYPES,
  HOUSE_TYPES,
  HouseType
} from '../../models/index.js';
import {CitySchema} from './city.schema.js';

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
    minlength: 10,
    maxlength: 100
  })
  public title!: string;

  @prop({
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 1024
  })
  public description!: string;

  @prop({
    required: true,
    default: () => new Date()
  })
  public publishDate!: Date;

  @prop({
    required: true,
    _id: false,
    type: () => CitySchema
  })
  public city!: CitySchema;

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
    default: false
  })
  public isFavorite!: boolean;

  @prop({
    required: true,
    min: 1,
    max: 5
  })
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: HOUSE_TYPES
  })
  public housingType!: HouseType;

  @prop({
    required: true,
    min: 1,
    max: 8
  })
  public roomsCount!: number;

  @prop({
    required: true,
    min: 1,
    max: 10
  })
  public guestsCount!: number;

  @prop({
    required: true,
    min: 100,
    max: 100000
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
  public userId!: Ref<UserEntity>;

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
