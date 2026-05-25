import {Expose, Type} from 'class-transformer';
import { OfferPreviewRdo } from './offer-preview.rdo.js';
import { UserRdo } from '../../user/index.js';
import {CoordinatesInterface} from '../../../models/index.js';

export class OfferRdo extends OfferPreviewRdo {
  @Expose()
  public description!: string;

  @Expose()
  public housingImages!: string[];

  @Expose()
  public roomsCount!: number;

  @Expose()
  public guestsCount!: number;

  @Expose()
  public amenities!: string[];

  @Expose()
  @Type(() => UserRdo)
  public author!: UserRdo;

  @Expose()
  public coordinates!: CoordinatesInterface;
}
