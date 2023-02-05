/* eslint-disable implicit-arrow-linebreak */
import { useState, useCallback, useEffect, useAppForm, useDispatch, useSelector } from 'hooks/hooks.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import { threadActionCreator } from 'store/actions.js';
import { image as imageService } from 'services/services.js';
import { ThreadToolbarKey, UseFormMode } from 'common/enums/enums.js';
import { Post, Spinner, Checkbox } from 'components/common/common.js';
import { ExpandedPost, SharedPostLink, AddPost, UpdatePost } from './components/components.js';
import { DEFAULT_THREAD_TOOLBAR } from './common/constants.js';

import styles from './styles.module.scss';

const postsFilter = {
  userId: undefined,
  from: 0,
  count: 10
};

const Thread = () => {
  const dispatch = useDispatch();
  const { posts, hasMorePosts, expandedPost, userId, postToEdit } = useSelector(state => ({
    posts: state.posts.posts,
    hasMorePosts: state.posts.hasMorePosts,
    expandedPost: state.posts.expandedPost,
    userId: state.profile.user.id,
    postToEdit: state.posts.postToEdit
  }));
  const [sharedPostId, setSharedPostId] = useState(undefined);

  const { control, watch } = useAppForm({
    defaultValues: DEFAULT_THREAD_TOOLBAR,
    mode: UseFormMode.ON_CHANGE
  });

  const showOwnPosts = watch(ThreadToolbarKey.SHOW_OWN_POSTS);

  const handlePostsLoad = useCallback(
    filtersPayload => {
      dispatch(threadActionCreator.loadPosts(filtersPayload));
    },
    [dispatch]
  );

  const handleToggleShowOwnPosts = useCallback(() => {
    postsFilter.userId = showOwnPosts ? userId : undefined;
    postsFilter.from = 0;
    handlePostsLoad(postsFilter);
    postsFilter.from = postsFilter.count; // for the next scroll
  }, [userId, showOwnPosts, handlePostsLoad]);

  useEffect(() => {
    handleToggleShowOwnPosts();
  }, [showOwnPosts, handleToggleShowOwnPosts]);

  const handlePostLike = useCallback(
    postId => dispatch(threadActionCreator.reactPost({ postId, isLike: true })),
    [dispatch]
  );

  const handlePostDislike = useCallback(
    postId => dispatch(threadActionCreator.reactPost({ postId, isLike: false })),
    [dispatch]
  );

  const handleExpandedPostToggle = useCallback(id => dispatch(threadActionCreator.toggleExpandedPost(id)), [dispatch]);

  const handleUpdatePostToggle = id => dispatch(threadActionCreator.togglePostToEdit(id), [dispatch]);

  const handlePostUpdate = useCallback(
    postPayload => dispatch(threadActionCreator.updatePost(postPayload)),
    [dispatch]
  );

  const handlePostAdd = useCallback(postPayload => dispatch(threadActionCreator.createPost(postPayload)), [dispatch]);
  const handlePostDelete = useCallback(
    postPayload => {
      dispatch(threadActionCreator.deletePost(postPayload));
    },
    [dispatch]
  );

  const handleMorePostsLoad = useCallback(
    filtersPayload => {
      dispatch(threadActionCreator.loadMorePosts(filtersPayload));
    },
    [dispatch]
  );

  const handleGetMorePosts = useCallback(() => {
    handleMorePostsLoad(postsFilter);
    const { from, count } = postsFilter;
    postsFilter.from = from + count;
  }, [handleMorePostsLoad]);

  const handleSharePost = id => setSharedPostId(id);

  const handleUploadImage = file => imageService.uploadImage(file);

  const handleCloseSharedPostLink = () => setSharedPostId(undefined);

  useEffect(() => {
    handleGetMorePosts();
  }, [handleGetMorePosts]);

  return (
    <div className={styles.threadContent}>
      <div className={styles.addPostForm}>
        <AddPost onPostAdd={handlePostAdd} onUploadImage={handleUploadImage} />
      </div>
      <form name="thread-toolbar">
        <div className={styles.toolbar}>
          <Checkbox name={ThreadToolbarKey.SHOW_OWN_POSTS} control={control} label="Show only my posts" />
        </div>
      </form>
      <div className={styles.posts}>
        <InfiniteScroll
          dataLength={posts.length}
          next={handleGetMorePosts}
          scrollThreshold={0.8}
          hasMore={hasMorePosts}
          loader={<Spinner key="0" />}
        >
          {posts.map(post => (
            <Post
              post={post}
              onPostLike={handlePostLike}
              onPostDislike={handlePostDislike}
              onExpandedPostToggle={handleExpandedPostToggle}
              onSharePost={handleSharePost}
              onUpdatePost={handleUpdatePostToggle}
              onDeletePost={handlePostDelete}
              key={post.id}
              userId={userId}
            />
          ))}
        </InfiniteScroll>
      </div>
      {expandedPost && (
        <ExpandedPost
          onSharePost={handleSharePost}
          onUpdatePost={handleUpdatePostToggle}
          onDeletePost={handlePostDelete}
        />
      )}
      {postToEdit && (
        <UpdatePost postId={postToEdit.id} onPostUpdate={handlePostUpdate} onUploadImage={handleUploadImage} />
      )}
      {sharedPostId && <SharedPostLink postId={sharedPostId} onClose={handleCloseSharedPostLink} />}
    </div>
  );
};

export { Thread };
