/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */

import { ForbiddenError, HttpError } from 'shared/src/exceptions/exceptions.js';
import { ExceptionMessage, HttpCode } from 'shared/src/common/enums/enums.js';
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

  async deleteById(postId, token) {
    const post = await this._postRepository.getById(postId);
    if (!post) {
      throw new HttpError({ message: 'Post Not Found', status: HttpCode.NOT_FOUND });
    } else {
      const { id } = verifyToken(token.slice(7));
      if (post.userId !== id) {
        throw new ForbiddenError(ExceptionMessage.INVALID_TOKEN);
      } else {
        return this._postRepository.softDeleteById(postId);
      }
    }
  }

  create(userId, post) {
    return this._postRepository.create({
      ...post,
      userId
    });
  }

  async updateById(postId, { body }, token) {
    const { userId } = await this.getById(postId);
    const { id } = verifyToken(token.slice(7));
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
    let reactionCount = await this._postReactionRepository.getReactionCount(postId);
    if (reactionCount) {
      if (Number.isInteger(result)) {
        delete reactionCount.post;
      } else {
        reactionCount.isLike = isLike;
      }
    } else {
      reactionCount = {
        dislikeCount: '0',
        likeCount: '0',
        postId,
        userId
      };
    }
    return reactionCount;
  }
}

export { Post };
