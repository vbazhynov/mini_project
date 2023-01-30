/* eslint-disable operator-linebreak */
/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
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

  async setReaction(userId, { postId, isLike = true }) {
    // define the callback for future use as a promise
    const updateOrDelete = react =>
      react.isLike === isLike
        ? this._postReactionRepository.deleteById(react.id)
        : this._postReactionRepository.updateById(react.id, {
            isLike
          });

    const reaction = await this._postReactionRepository.getPostReaction(
      userId,
      postId
    );
    let result = reaction
      ? await updateOrDelete(reaction)
      : await this._postReactionRepository.create({ userId, postId, isLike });

    const reactionCount = await this._postReactionRepository.getReactionCount(
      postId
    );

    result = Number.isInteger(result)
      ? {}
      : await this._postReactionRepository.getPostReaction(userId, postId);
    result.reactionCount = reactionCount || {
      likeCount: '0',
      dislikeCount: '0'
    };
    return result;
  }
}

export { Post };
