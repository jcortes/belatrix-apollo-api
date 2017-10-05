import express from "express";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import compression from "compression";
import bodyParser from "body-parser";
import { isString } from "lodash";
import { createServer } from "http";

import { Authors, Posts } from "./sql/models";

import schema from "./schema";

const WS_GQL_PATH = "/subscriptions";

export const run = ({
  PORT: portFromEnv = 3010
} = {}) => {
  const port = isString(portFromEnv) ?
    parseInt(portFromEnv, 10) : portFromEnv;

  const wsGqlURL = process.env.NODE_ENV !== "production"
    ? `ws://localhost:${port}${WS_GQL_PATH}`
    : `ws://api.belatrix.com${WS_GQL_PATH}`;

  const app = express();

  // app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use("/graphiql", graphiqlExpress({
    endpointURL: "/graphql",
    // subscriptionsEndpoint: wsGqlURL
  }));

  app.use("/graphql", graphqlExpress((req) => {
    // Get the query, the same way express-graphql does it
    // https://github.com/graphql/express-graphql/blob/3fa6e68582d6d933d37fa9e841da5d2aa39261cd/src/index.js#L257
    const query = req.query.query || req.body.query;
    if (query && query.length > 2000) {
      // None of our app's queries are this long
      // Probably indicates someone trying to send an overly expensive query
      throw new Error("Query too large.");
    }

    return {
      schema,
      context: {
        Authors: new Authors(),
        Posts: new Posts()
      },
    };
  }));

  const server = createServer(app);

  server.listen(port, () => {
    console.log(`API Server is now running on http://localhost:${port}`); // eslint-disable-line no-console
    // console.log(`API Server over web socket with subscriptions is now running on ws://localhost:${port}${WS_GQL_PATH}`); // eslint-disable-line no-console
  });
}