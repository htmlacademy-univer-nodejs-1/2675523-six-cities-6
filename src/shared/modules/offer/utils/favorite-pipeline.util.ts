import { PipelineStage, Types } from 'mongoose';

export const buildFavoritePipeline = (userId?: string): PipelineStage[] => {
  if (!userId) {
    return [
      {
        $addFields: {
          isFavorite: false
        }
      }
    ];
  }

  return [
    {
      $lookup: {
        from: 'favorites',
        let: { offerId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$offerId', '$$offerId'] },
                  { $eq: ['$userId', new Types.ObjectId(userId)] }
                ]
              }
            }
          }
        ],
        as: 'favorite'
      }
    },
    {
      $addFields: {
        isFavorite: { $gt: [{ $size: '$favorite' }, 0] }
      }
    },
    {
      $project: {
        favorite: 0
      }
    }
  ];
};
