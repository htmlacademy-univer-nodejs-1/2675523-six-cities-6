import {
  CoordinatesInterface,
  findAmenityType,
  findCityName,
  findHouseType,
  findUserType,
  OfferInterface, UserInterface
} from '../models/index.js';

export function createOffer(offerData: string): OfferInterface {
  const [
    title,
    description,
    cityName,
    previewImage,
    photosRaw,
    isPremiumRaw,
    typeRaw,
    roomsRaw,
    guestsCount,
    priceRaw,
    amenitiesRaw,
    authorName,
    authorEmail,
    authorTypeRaw,
    coordinatesRaw
  ] = offerData.replace('\n', '').split('\t');

  const houseType = findHouseType(typeRaw?.trim());
  if (!houseType) {
    throw new Error(`Invalid HouseType: "${typeRaw}"`);
  }

  const city = findCityName(cityName?.trim());
  if (!city) {
    throw new Error(`Invalid CityName: "${cityName}"`);
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
    avatar: '',
    type: userType,
  };

  return {
    title: title?.trim(),
    description: description?.trim(),
    city,
    previewImage: previewImage?.trim(),
    photos: photosRaw?.split(';').map((photo) => photo.trim()),
    isPremium: isPremiumRaw?.trim().toLowerCase() === 'true',
    type: houseType,
    rooms: Number.parseInt(roomsRaw, 10),
    price: Number.parseInt(priceRaw, 10),
    amenities,
    author,
    guestsCount: parseInt(guestsCount, 10),
    coordinates: {
      latitude,
      longitude,
    } satisfies CoordinatesInterface,
  };
}
