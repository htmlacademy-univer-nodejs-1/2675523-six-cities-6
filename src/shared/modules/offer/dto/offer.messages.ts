export const OfferValidationMessage = {
  title: {
    invalid: 'Title must be a string',
    length: 'Title must be between 10 and 100 characters long',
  },
  description: {
    invalid: 'Description must be a string',
    length: 'Description must be between 20 and 1024 characters long',
  },
  city: {
    invalid: 'City must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf',
  },
  previewImage: {
    invalid: 'Preview image must be a valid URL',
  },
  housingImages: {
    isArray: 'Housing images must be an array',
    arraySize: 'Housing images must contain exactly 6 items',
    invalid: 'Each housing image must be a valid URL',
  },
  isPremium: {
    invalid: 'Premium status must be a boolean',
  },
  housingType: {
    invalid: 'Housing type must be one of: apartment, house, room, hotel',
  },
  roomsCount: {
    invalid: 'Rooms count must be an integer',
    min: 'Rooms count must be at least 1',
    max: 'Rooms count must be at most 8',
  },
  guestsCount: {
    invalid: 'Guests count must be an integer',
    min: 'Guests count must be at least 1',
    max: 'Guests count must be at most 10',
  },
  price: {
    invalid: 'Price must be an integer',
    min: 'Price must be at least 100',
    max: 'Price must be at most 100000',
  },
  amenities: {
    isArray: 'Amenities must be an array',
    invalid: 'Each amenity must be one of: Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge',
  }
} as const;
