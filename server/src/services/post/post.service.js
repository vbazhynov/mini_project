/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */

import { ForbiddenError } from 'shared/src/exceptions/exceptions.js';
import { ExceptionMessage } from 'shared/src/common/enums/enums.js';
import { verifyToken } from '../../helpers/helpers.js';

class Post {
  constructor({ postRepository, postReactionRepository }) {
    this._postRepository = postRepository;
    this._postReactionRepository = postReactionRepository;
  }

  getPosts(filter) {
    return this._postRepository.getPosts(filter);
  }

  getById(id) {
    return this._postRepository.getPostById(id);
  }

  create(userId, post) {
    return this._postRepository.create({
      ...post,
      userId
    });
  }

  updateById(postId, { body, userId }, token) {
    const { id } = verifyToken(token.slice(7));
    console.log(id);
    if (!(userId === id)) {
      throw new ForbiddenError(ExceptionMessage.INVALID_TOKEN);
    } else {
      return this._postRepository.updateById(postId, { body });
    }
  }

  async setReaction(userId, { postId, isLike = true }) {
    // define the callback for future use as a promise
    const updateOrDelete = react =>
      react.isLike === isLike
        ? this._postReactionRepository.deleteById(react.id)
        : this._postReactionRepository.updateById(react.id, {
            isLike
          });

    const reaction = await this._postReactionRepository.getPostReaction(userId, postId);
    const result = reaction
      ? await updateOrDelete(reaction)
      : await this._postReactionRepository.create({ userId, postId, isLike });
    const reactionCount = await this._postReactionRepository.getReactionCount(postId);
    if (Number.isInteger(result)) {
      delete reactionCount.post;
    } else {
      reactionCount.isLike = isLike;
    }
    return reactionCount;
  }
}

export { Post };
