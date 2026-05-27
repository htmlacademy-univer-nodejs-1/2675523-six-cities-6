import {OfferGeneratorInterface} from './models/offer-generator.interface.js';
import {
  AMENITY_TYPES,
  HOUSE_TYPES,
  HouseType,
  MockServerData, USER_TYPES, UserType
} from '../../models/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems
} from '../../helpers/index.js';

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 8;

const MIN_GUESTS_COUNT = 1;
const MAX_GUESTS_COUNT = 10;

const MIN_PRICE = 100;
const MAX_PRICE = 100_000;

export class TSVOfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const housingImages = getRandomItems(this.mockData.housingImages, 6).join(';');
    const isPremium = String(generateRandomValue(0, 1) === 1);
    const housingType = getRandomItem<HouseType>(HOUSE_TYPES);
    const roomsCount = generateRandomValue(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT).toString();
    const guestsCount = generateRandomValue(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const amenities = getRandomItems<string>(AMENITY_TYPES, 1).join(';');
    const authorName = getRandomItem(this.mockData.authorNames);
    const authorEmail = getRandomItem(this.mockData.authorEmails);
    const authorType = getRandomItem<UserType>(USER_TYPES);
    const coordinates = getRandomItem(this.mockData.coordinatesValues).join(',');

    return [
      title,
      description,
      city,
      previewImage,
      housingImages,
      isPremium,
      housingType,
      roomsCount,
      guestsCount,
      price,
      amenities,
      authorName,
      authorEmail,
      authorType,
      coordinates
    ].join('\t');
  }

}
