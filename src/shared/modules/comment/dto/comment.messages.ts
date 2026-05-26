export const CommentValidationMessage = {
  text: {
    invalid: 'Comment text must be a string',
    length: 'Comment text must be between 5 and 1024 characters long',
  },
  rating: {
    invalid: 'Rating must be a number',
    min: 'Rating must be at least 1',
    max: 'Rating must be at most 5',
  }
} as const;
