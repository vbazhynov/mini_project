import PropTypes from 'prop-types';
import { useCallback, useDispatch, useSelector, useAppForm, useState } from 'hooks/hooks.js';
import { ButtonColor, ButtonType, IconName, PostPayloadKey } from 'common/enums/enums.js';
import { threadActionCreator } from 'store/actions.js';
import { Spinner, Input, Modal, Button, Image } from 'components/common/common.js';

import styles from './styles.module.scss';

const UpdatePost = ({ postId, onPostUpdate, onUploadImage }) => {
  const [image, setImage] = useState(undefined);
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const { post, userId } = useSelector(state => ({
    post: state.posts.postToEdit,
    userId: state.profile.user.id
  }));

  const { control, handleSubmit, reset } = useAppForm({
    defaultValues: {
      [PostPayloadKey.BODY]: post.body
    }
  });

  const handleUploadFile = ({ target }) => {
    setIsUploading(true);
    const [file] = target.files;
    onUploadImage(file)
      .then(({ imageId, link: imageLink }) => {
        setImage({ imageId, imageLink });
      })
      .catch(() => {
        // TODO: show error
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handlePostUpdate = useCallback(
    values => {
      if (!values.body) {
        return;
      }
      onPostUpdate({ userId, postId, imageId: image?.imageId, body: values.body }).then(() => {
        reset();
        setImage(undefined);
      });
    },
    [userId, image, reset, onPostUpdate, postId]
  );

  const handleEditPostToggle = useCallback(id => dispatch(threadActionCreator.togglePostToEdit(id)), [dispatch]);

  const handleEditPostPostClose = () => handleEditPostToggle();

  return (
    <Modal isOpen onClose={handleEditPostPostClose}>
      {post ? (
        <form onSubmit={handleSubmit(handlePostUpdate)}>
          <Input
            name={PostPayloadKey.BODY}
            placeholder="Plase your changes here!"
            value={post.body}
            rows={5}
            control={control}
          />
          {image?.imageLink && (
            <div className={styles.imageWrapper}>
              <Image className={styles.image} src={image?.imageLink} alt="post image" />
            </div>
          )}
          <div className={styles.btnWrapper}>
            <Button color="teal" isLoading={isUploading} isDisabled={isUploading} iconName={IconName.IMAGE}>
              <label className={styles.btnImgLabel}>
                Attach image
                <input name="image" type="file" onChange={handleUploadFile} hidden />
              </label>
            </Button>
            <Button color={ButtonColor.BLUE} type={ButtonType.BUTTON} onClick={handleEditPostPostClose}>
              Cancel
            </Button>
            <Button color={ButtonColor.BLUE} type={ButtonType.SUBMIT}>
              Update Post
            </Button>
          </div>
        </form>
      ) : (
        <Spinner />
      )}
    </Modal>
  );
};

UpdatePost.propTypes = {
  postId: PropTypes.number.isRequired,
  onPostUpdate: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func.isRequired
};

export { UpdatePost };
