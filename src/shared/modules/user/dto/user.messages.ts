export const UserValidationMessage = {
  name: {
    invalid: 'Name must be a string',
    length: 'Name must be between 1 and 15 characters long',
  },
  email: {
    invalid: 'Email must be a valid address',
  },
  avatar: {
    invalid: 'Avatar must be a valid URL',
  },
  type: {
    invalid: 'User type must be one of: default, pro',
  },
  password: {
    invalid: 'Password must be a string',
    length: 'Password must be between 6 and 12 characters long',
  },
} as const;
