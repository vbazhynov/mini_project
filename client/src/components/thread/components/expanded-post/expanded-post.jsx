import PropTypes from 'prop-types';
import { useCallback, useDispatch, useSelector } from 'hooks/hooks.js';
import { threadActionCreator } from 'store/actions.js';
import { Spinner, Post, Modal } from 'components/common/common.js';
import { Comment, AddComment } from 'components/thread/components/components.js';
import { getSortedComments } from './helpers/helpers.js';

const ExpandedPost = ({ onSharePost, onUpdatePost }) => {
  const dispatch = useDispatch();
  const { post, userId } = useSelector(state => ({
    post: state.posts.expandedPost,
    userId: state.profile.user.id
  }));

  const handlePostLike = useCallback(
    postId => dispatch(threadActionCreator.reactPost({ postId, isLike: true })),
    [dispatch]
  );

  const handlePostDislike = useCallback(
    postId => dispatch(threadActionCreator.reactPost({ postId, isLike: false })),
    [dispatch]
  );

  const handleCommentAdd = useCallback(
    commentPayload => dispatch(threadActionCreator.addComment(commentPayload)),
    [dispatch]
  );

  const handleExpandedPostToggle = useCallback(id => dispatch(threadActionCreator.toggleExpandedPost(id)), [dispatch]);

  const handleExpandedPostClose = () => handleExpandedPostToggle();

  const sortedComments = getSortedComments(post.comments ?? []);

  return (
    <Modal isOpen onClose={handleExpandedPostClose}>
      {post ? (
        <>
          <Post
            post={post}
            onPostLike={handlePostLike}
            onPostDislike={handlePostDislike}
            onExpandedPostToggle={handleExpandedPostToggle}
            onSharePost={onSharePost}
            onUpdatePost={onUpdatePost}
            userId={userId}
          />
          <div>
            <h3>Comments</h3>
            {sortedComments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
            <AddComment postId={post.id} onCommentAdd={handleCommentAdd} />
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </Modal>
  );
};

ExpandedPost.propTypes = {
  onSharePost: PropTypes.func.isRequired,
  onUpdatePost: PropTypes.func.isRequired
};

export { ExpandedPost };
