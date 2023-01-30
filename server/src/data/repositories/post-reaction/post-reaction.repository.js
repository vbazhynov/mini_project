import { Abstract } from '../abstract/abstract.repository.js';

class PostReaction extends Abstract {
  constructor({ postReactionModel }) {
    super(postReactionModel);
  }

  getPostReaction(userId, postId) {
    return this.model
      .query()
      .select()
      .where({ userId })
      .andWhere({ postId })
      .withGraphFetched('[post]')
      .first();
  }

  getPostLikesById(postId) {
    return this.model
      .query()
      .count('isLike')
      .where('isLike', true)
      .where({ postId })
      .as('likeCount')
      .first();
  }

  getPostDislikesById(postId) {
    return this.model
      .query()
      .count('is_like')
      .where('is_like', false)
      .where({ postId })
      .as('dislikeCount')
      .first();
  }

  getReactionCount(postId) {
    return this.model
      .query()
      .select(this.getPostLikesById(postId), this.getPostDislikesById(postId))
      .where({ postId })
      .first();
  }
}

export { PostReaction };
