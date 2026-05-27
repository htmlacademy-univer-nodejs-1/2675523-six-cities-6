import {
  AmenitiesType,
  CityName,
  CoordinatesInterface,
  findAmenityType,
  findCityName,
  findHouseType,
  findUserType,
  HouseType,
  OfferInterface, UserInterface
} from '../models/index.js';

type OfferDataFields = {
  title: string;
  description: string;
  cityName: string;
  previewImage: string;
  photosRaw: string;
  isPremiumRaw: string;
  typeRaw: string;
  roomsRaw: string;
  guestsCountRaw: string;
  priceRaw: string;
  amenitiesRaw: string;
  authorName: string;
  authorEmail: string;
  authorTypeRaw: string;
  coordinatesRaw: string;
};

export function createOffer(offerData: string): OfferInterface {
  const fields = parseOfferDataFields(offerData);
  const houseType = parseHouseType(fields.typeRaw);
  const city = parseCity(fields.cityName);
  const userType = parseUserType(fields.authorTypeRaw);
  const amenities = parseAmenities(fields.amenitiesRaw);
  const coordinates = parseCoordinates(fields.coordinatesRaw);

  const author: UserInterface = {
    name: fields.authorName?.trim(),
    email: fields.authorEmail?.trim(),
    avatar: '',
    type: userType,
  };

  return {
    title: fields.title?.trim(),
    description: fields.description?.trim(),
    city,
    previewImage: fields.previewImage?.trim(),
    photos: fields.photosRaw?.split(';').map((photo) => photo.trim()),
    isPremium: fields.isPremiumRaw?.trim().toLowerCase() === 'true',
    type: houseType,
    rooms: Number.parseInt(fields.roomsRaw, 10),
    price: Number.parseInt(fields.priceRaw, 10),
    amenities,
    author,
    guestsCount: parseInt(fields.guestsCountRaw, 10),
    coordinates,
  };
}

function parseOfferDataFields(offerData: string): OfferDataFields {
  const [
    title,
    description,
    cityName,
    previewImage,
    photosRaw,
    isPremiumRaw,
    typeRaw,
    roomsRaw,
    guestsCountRaw,
    priceRaw,
    amenitiesRaw,
    authorName,
    authorEmail,
    authorTypeRaw,
    coordinatesRaw
  ] = offerData.replace('\n', '').split('\t');

  return {
    title,
    description,
    cityName,
    previewImage,
    photosRaw,
    isPremiumRaw,
    typeRaw,
    roomsRaw,
    guestsCountRaw,
    priceRaw,
    amenitiesRaw,
    authorName,
    authorEmail,
    authorTypeRaw,
    coordinatesRaw
  };
}

function parseHouseType(typeRaw: string): HouseType {
  const houseType = findHouseType(typeRaw?.trim());

  if (houseType) {
    return houseType;
  }

  throw new Error(`Invalid HouseType: "${typeRaw}"`);
}

function parseCity(cityName: string): CityName {
  const city = findCityName(cityName?.trim());

  if (city) {
    return city;
  }

  throw new Error(`Invalid CityName: "${cityName}"`);
}

function parseUserType(authorTypeRaw: string): UserInterface['type'] {
  const userType = findUserType(authorTypeRaw?.trim());

  if (userType) {
    return userType;
  }

  throw new Error(`Invalid UserType: "${authorTypeRaw}"`);
}

function parseAmenities(amenitiesRaw: string): AmenitiesType[] {
  return amenitiesRaw
    ?.split(';')
    .map((amenity) => {
      const found = findAmenityType(amenity.trim());
      if (!found) {
        throw new Error(`Invalid AmenitiesType: "${amenity}"`);
      }
      return found;
    });
}

function parseCoordinates(coordinatesRaw: string): CoordinatesInterface {
  const [latitude, longitude] = coordinatesRaw
    .split(',')
    .map((coord) => Number.parseFloat(coord));

  return { latitude, longitude };
}
