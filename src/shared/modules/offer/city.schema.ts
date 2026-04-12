import {prop} from '@typegoose/typegoose';

export class CitySchema {
  @prop({ required: true, trim: true })
  public name!: string;

  @prop({ required: true })
  public latitude!: number;

  @prop({ required: true })
  public longitude!: number;
}
