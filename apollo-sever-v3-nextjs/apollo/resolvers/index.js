import { gql } from "apollo-server-micro";

import { pubsub } from "../pubsub";

export const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Subscription {
    getBook: [Book]
  }
  type Query {
    books: [Book]
  }
`;

export const resolvers = {
  Query: {
    books: (parent, args, context) => {
      pubsub.publish("POST_CREATED", { getBook: books });
      return books;
    },
  },
  Subscription: {
    getBook: {
      subscribe: () => pubsub.asyncIterator(["POST_CREATED"]),
    },
  },
};

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];
