import { merge } from "lodash";
import { makeExecutableSchema } from "graphql-tools";
import { schema as sqlSchema, resolvers as sqlResolvers } from "./sql/schema.js";

const rootSchema = [`
  type Query {
    posts: [Post]
    author(id: Int!): Author
  }

  type Mutation {
    upvotePost (
      postId: Int!
    ): Post
  }
`];

const rootResolvers = {
  Query: {
    posts: (_, params, context) => context.Posts.getPosts(),
    author: (_, { id }, context) => context.Authors.getAuthorById(id)
  },
  Mutation: {
    upvotePost: (_, { postId }, context) => context.Posts.upVotePost(postId)
  }
};

const schema = [...rootSchema, ...sqlSchema];
const resolvers = merge(rootResolvers, sqlResolvers);

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

export default executableSchema;