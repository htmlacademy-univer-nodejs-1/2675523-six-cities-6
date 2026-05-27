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
const HOUSING_IMAGES_COUNT = 6;
const AMENITIES_COUNT = 1;

export class TSVOfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const housingImages = this.getHousingImages();
    const isPremium = this.getPremiumFlag();
    const housingType = getRandomItem<HouseType>(HOUSE_TYPES);
    const roomsCount = this.getRoomsCount();
    const guestsCount = this.getGuestsCount();
    const price = this.getPrice();
    const amenities = this.getAmenities();
    const authorName = getRandomItem(this.mockData.authorNames);
    const authorEmail = getRandomItem(this.mockData.authorEmails);
    const authorType = getRandomItem<UserType>(USER_TYPES);
    const coordinates = this.getCoordinates();

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

  private getHousingImages(): string {
    return getRandomItems(this.mockData.housingImages, HOUSING_IMAGES_COUNT).join(';');
  }

  private getPremiumFlag(): string {
    return String(generateRandomValue(0, 1) === 1);
  }

  private getRoomsCount(): string {
    return generateRandomValue(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT).toString();
  }

  private getGuestsCount(): string {
    return generateRandomValue(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT).toString();
  }

  private getPrice(): string {
    return generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
  }

  private getAmenities(): string {
    return getRandomItems<string>(AMENITY_TYPES, AMENITIES_COUNT).join(';');
  }

  private getCoordinates(): string {
    return getRandomItem(this.mockData.coordinatesValues).join(',');
  }
}
