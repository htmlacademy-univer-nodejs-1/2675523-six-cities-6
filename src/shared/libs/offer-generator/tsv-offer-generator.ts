import {OfferGeneratorInterface} from './models/offer-generator.interface.js';
import dayjs from 'dayjs';
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

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 8;

const MIN_GUESTS_COUNT = 1;
const MAX_GUESTS_COUNT = 10;

const MIN_PRICE = 100;
const MAX_PRICE = 100_000;

const MIN_COMMENTS_COUNT = 0;
const MAX_COMMENTS_COUNT = 100;

export class TSVOfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const publishDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const housingImages = getRandomItems(this.mockData.housingImages, 6).join(';');
    const isPremium = String(generateRandomValue(0, 1) === 1);
    const isFavorite = String(generateRandomValue(0, 1) === 1);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const housingType = getRandomItem<HouseType>(HOUSE_TYPES);
    const roomsCount = generateRandomValue(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT).toString();
    const guestsCount = generateRandomValue(MIN_GUESTS_COUNT, MAX_GUESTS_COUNT).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const amenities = getRandomItems<string>(AMENITY_TYPES, 1).join(';');
    const authorName = getRandomItem(this.mockData.authorNames);
    const authorEmail = getRandomItem(this.mockData.authorEmails);
    const authorAvatar = getRandomItem(this.mockData.authorAvatars);
    const authorType = getRandomItem<UserType>(USER_TYPES);
    const commentsCount = generateRandomValue(MIN_COMMENTS_COUNT, MAX_COMMENTS_COUNT).toString();
    const coordinates = getRandomItem(this.mockData.coordinatesValues).join(';');

    return [
      title,
      description,
      publishDate,
      city,
      previewImage,
      housingImages,
      isPremium,
      isFavorite,
      rating,
      housingType,
      roomsCount,
      guestsCount,
      price,
      amenities,
      authorName,
      authorEmail,
      authorAvatar,
      authorType,
      commentsCount,
      coordinates
    ].join('\t');
  }

}
