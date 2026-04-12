import { CommandInterface } from './models/index.js';
import {
  createOffer, getMongoURI, OfferInterface,
  TSVFileReader
} from '../../shared/index.js';
import {
  DefaultUserService, UserModel,
  UserServiceInterface
} from '../../shared/modules/user/index.js';
import {
  DefaultOfferService, OfferModel,
  OfferServiceInterface
} from '../../shared/modules/offer/index.js';
import {
  DatabaseClientInterface, MongoDatabaseClient
} from '../../shared/libs/database-client/index.js';
import {LoggerInterface} from '../../shared/libs/logger/models/index.js';
import {ConsoleLogger} from '../../shared/libs/logger/index.js';
import {
  DEFAULT_DB_PORT,
  DEFAULT_USER_PASSWORD
} from './constants/command.constant.js';

export class ImportCommand implements CommandInterface {
  private readonly userService: UserServiceInterface;
  private readonly offerService: OfferServiceInterface;
  private readonly databaseClient: DatabaseClientInterface;
  private readonly logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(
    fileName: string,
    login: string,
    password: string,
    host: string,
    dbName: string,
    salt: string
  ): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbName);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(fileName.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      this.logger.error(`Can't import data from file: ${fileName}`, error as Error);
    }
  }

  private async onImportedLine(line: string, resolve: () => void): Promise<void> {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    this.logger.info(`${count} rows imported`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: OfferInterface): Promise<void> {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      publishDate: offer.publishDate,
      city: offer.city,
      previewImage: offer.previewImage,
      housingImages: offer.photos,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      housingType: offer.type,
      roomsCount: offer.rooms,
      guestsCount: offer.guestsCount,
      price: offer.price,
      amenities: offer.amenities,
      authorId: user.id,
      coordinates: offer.coordinates
    });
  }
}
