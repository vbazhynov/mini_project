import {
  HttpCode,
  HttpMethod,
  PostsApiPath,
  ControllerHook,
  SocketNamespace,
  NotificationSocketEvent
} from '../../common/enums/enums.js';

const initPost = (fastify, opts, done) => {
  const { post: postService } = opts.services;

  fastify.route({
    method: HttpMethod.GET,
    url: PostsApiPath.ROOT,
    [ControllerHook.HANDLER]: req => postService.getPosts(req.query)
  });

  fastify.route({
    method: HttpMethod.GET,
    url: PostsApiPath.$ID,
    [ControllerHook.HANDLER]: req => postService.getById(req.params.id)
  });

  fastify.route({
    method: HttpMethod.PUT,
    url: PostsApiPath.ROOT,
    [ControllerHook.HANDLER]: async (req, res) => {
      const post = await postService.updateById(req.body);
      // notify all users that a new post was created
      // req.io.of(SocketNamespace.NOTIFICATION).emit(NotificationSocketEvent.UPDATE_POST, post);
      return res.status(HttpCode.OK).send(post);
    }
  });

  fastify.route({
    method: HttpMethod.POST,
    url: PostsApiPath.ROOT,
    [ControllerHook.HANDLER]: async (req, res) => {
      const post = await postService.create(req.user.id, req.body);

      // notify all users that a new post was created
      req.io.of(SocketNamespace.NOTIFICATION).emit(NotificationSocketEvent.NEW_POST, post);
      return res.status(HttpCode.CREATED).send(post);
    }
  });

  fastify.route({
    method: HttpMethod.PUT,
    url: PostsApiPath.REACT,
    [ControllerHook.HANDLER]: async req => {
      const reaction = await postService.setReaction(req.user.id, req.body);
      req.io.of(SocketNamespace.NOTIFICATION).emit(NotificationSocketEvent.UPDATE_REACTIONS, reaction);
      if (reaction.post && reaction.post.userId !== req.user.id) {
        // notify a user if someone (not himself) liked his post
        req.io
          .of(SocketNamespace.NOTIFICATION)
          .to(`${reaction.post.userId}`)
          .emit(reaction.isLike ? NotificationSocketEvent.LIKE_POST : NotificationSocketEvent.DISLIKE_POST);
      }
      return reaction;
    }
  });

  done();
};

export { initPost };
