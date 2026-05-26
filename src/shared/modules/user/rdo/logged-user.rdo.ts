import { Expose } from 'class-transformer';

export class LoggerUserRdo {
  @Expose()
  public token!: string;

  @Expose()
  public email!: string;
}
