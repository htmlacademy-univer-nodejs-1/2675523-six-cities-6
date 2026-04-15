import { PipelineStage } from 'mongoose';

export const statsPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'author'
    }
  },
  { $unwind: '$author' },
  {
    $lookup: {
      from: 'comments',
      let: { offerId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$offerId', '$$offerId'] }
          }
        },
        {
          $group: {
            _id: null,
            rating: { $avg: '$rating' },
            commentsCount: { $sum: 1 }
          }
        }
      ],
      as: 'stats'
    }
  },

  {
    $addFields: {
      rating: {
        $ifNull: [{ $arrayElemAt: ['$stats.rating', 0] }, 5]
      },
      commentsCount: {
        $ifNull: [{ $arrayElemAt: ['$stats.commentsCount', 0] }, 0]
      }
    }
  }
];

export const previewProjection: PipelineStage.Project = {
  $project: {
    _id: 0,
    id: { $toString: '$_id' },
    title: 1,
    publishDate: '$createdAt',
    city: 1,
    previewImage: 1,
    isPremium: 1,
    isFavorite: 1,
    housingType: 1,
    price: 1,
    rating: { $round: ['$rating', 1] },
    commentsCount: 1
  }
};

export const fullProjection = {
  $project: {
    _id: 0,
    id: { $toString: '$_id' },
    title: 1,
    description: 1,
    publishDate: '$createdAt',
    city: 1,
    previewImage: 1,
    housingImages: 1,
    isPremium: 1,
    isFavorite: 1,
    housingType: 1,
    roomsCount: 1,
    guestsCount: 1,
    price: 1,
    amenities: 1,
    rating: { $round: ['$rating', 1] },
    commentsCount: 1,
    coordinates: 1,

    author: {
      id: { $toString: '$author._id' },
      name: '$author.name',
      email: '$author.email',
      avatar: '$author.avatar',
      type: '$author.type'
    }
  }
};
