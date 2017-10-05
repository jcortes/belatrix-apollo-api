export const schema = [`
  type Author {
    id: Int!
    firstName: String
    lastName: String
    posts: [Post] # lista de posts por autor
  }
  type Post {
    id: Int!
    title: String
    author: Author
    votes: Int
  }
`];

export const resolvers = {
  Author: {
    posts: (author, _, context) => context.Posts.getPostsByAuthorId(author.id)
  },
  Post: {
    author: (post, _, context) => context.Authors.getAuthorById(post.authorId),
  },
};