import {
  CityInterface, CoordinatesInterface,
  findAmenityType,
  findHouseType,
  findUserType,
  OfferInterface, UserInterface
} from '../models/index.js';

export function createOffer(offerData: string): OfferInterface {
  const [
    title,
    description,
    publishDate,
    cityName,
    previewImage,
    photosRaw,
    isPremiumRaw,
    isFavoriteRaw,
    ratingRaw,
    typeRaw,
    roomsRaw,
    guestsCount,
    priceRaw,
    amenitiesRaw,
    authorName,
    authorEmail,
    authorAvatar,
    authorTypeRaw,
    commentsCountRaw,
    coordinatesRaw
  ] = offerData.replace('\n', '').split('\t');

  const houseType = findHouseType(typeRaw?.trim());
  if (!houseType) {
    throw new Error(`Invalid HouseType: "${typeRaw}"`);
  }

  const userType = findUserType(authorTypeRaw?.trim());
  if (!userType) {
    throw new Error(`Invalid UserType: "${authorTypeRaw}"`);
  }

  const amenities = amenitiesRaw
    ?.split(';')
    .map((amenity) => {
      const found = findAmenityType(amenity.trim());
      if (!found) {
        throw new Error(`Invalid AmenitiesType: "${amenity}"`);
      }
      return found;
    });

  const [latitude, longitude] = coordinatesRaw
    .split(',')
    .map((coord) => Number.parseFloat(coord));

  const author: UserInterface = {
    name: authorName?.trim(),
    email: authorEmail?.trim(),
    avatar: authorAvatar?.trim() || undefined,
    type: userType,
  };

  return {
    title: title?.trim(),
    description: description?.trim(),
    publishDate: new Date(publishDate),
    city: {
      name: cityName?.trim(),
      latitude,
      longitude,
    } satisfies CityInterface,
    previewImage: previewImage?.trim(),
    photos: photosRaw?.split(';').map((photo) => photo.trim()),
    isPremium: isPremiumRaw?.trim().toLowerCase() === 'true',
    isFavorite: isFavoriteRaw?.trim().toLowerCase() === 'true',
    rating: Number.parseFloat(ratingRaw),
    type: houseType,
    rooms: Number.parseInt(roomsRaw, 10),
    price: Number.parseInt(priceRaw, 10),
    amenities,
    author,
    guestsCount: parseInt(guestsCount, 10),
    commentsCount: Number.parseInt(commentsCountRaw, 10),
    coordinates: {
      latitude,
      longitude,
    } satisfies CoordinatesInterface,
  };
}
