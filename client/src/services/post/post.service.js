import { ApiPath, PostsApiPath, HttpMethod, ContentType } from 'common/enums/enums';

class Post {
  constructor({ apiPath, http }) {
    this._apiPath = apiPath;
    this._http = http;
  }

  getAllPosts(filter) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}`, {
      method: HttpMethod.GET,
      query: filter
    });
  }

  getPost(id) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}${PostsApiPath.ROOT}${id}`, {
      method: HttpMethod.GET
    });
  }

  deletePost(id) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}${PostsApiPath.ROOT}${id}`, {
      method: HttpMethod.DELETE
    });
  }

  addPost(payload) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}`, {
      method: HttpMethod.POST,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload)
    });
  }

  updatePost(payload) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}${PostsApiPath.ROOT}${payload.postId}`, {
      method: HttpMethod.PUT,
      contentType: ContentType.JSON,
      payload: JSON.stringify(payload)
    });
  }

  likePost(postId) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}${PostsApiPath.REACT}`, {
      method: HttpMethod.PUT,
      contentType: ContentType.JSON,
      payload: JSON.stringify({
        postId
      })
    });
  }

  dislikePost(postId) {
    return this._http.load(`${this._apiPath}${ApiPath.POSTS}${PostsApiPath.REACT}`, {
      method: HttpMethod.PUT,
      contentType: ContentType.JSON,
      payload: JSON.stringify({
        postId,
        isLike: false
      })
    });
  }
}

export { Post };
