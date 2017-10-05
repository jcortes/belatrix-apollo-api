import { find, filter } from "lodash";

import connector from "./connector";
const { authors, posts } = connector();

export class Posts {
  getPosts() {
    return posts;
  }

  upVotePost(postId) {
    const post = find(posts, { id: postId });
    if (!post) {
      throw new Error(`Couldn't find post with id ${postId}`);
    }
    post.votes += 1;
    return post;
  }

  getPostsByAuthorId(authorId) {
    return filter(posts, { authorId });
  }
}

export class Authors {
  getAuthorById(id) {
    return find(authors, { id });
  }
}