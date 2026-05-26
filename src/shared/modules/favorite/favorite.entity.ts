import { defaultClasses, getModelForClass, index, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { OfferEntity } from '../offer/index.js';

export interface FavoriteEntity extends defaultClasses.Base {}

@index({ userId: 1, offerId: 1 }, { unique: true })
@modelOptions({
  schemaOptions: {
    collection: 'favorites',
    timestamps: true,
  }
})
export class FavoriteEntity extends defaultClasses.TimeStamps {
  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({
    ref: OfferEntity,
    required: true
  })
  public offerId!: Ref<OfferEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);
