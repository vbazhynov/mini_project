const getCommentsCountQuery = model => model.relatedQuery('comments').count().as('commentCount');

const getReactionsQuery = model => isLike => {
  const col = isLike ? 'likeCount' : 'dislikeCount';

  return model.relatedQuery('postReactions').count().where({ isLike }).as(col);
};

// const getWhereUserIdQuery = userId => builder => {
//   if (userId) {
//     builder.where({ userId });
//   }
// };

const getFilteredQuery = (userMode, userId) => builder => {
  if (userMode === 'likedByOwn') {
    builder.joinRelated('postReactions').where('postReactions.isLike', true).where('postReactions.userId', userId);
  } else if (userId) {
    builder.where({ userId });
  }
};

export { getCommentsCountQuery, getReactionsQuery, getFilteredQuery };
