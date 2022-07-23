import { ApolloClient, InMemoryCache } from "@apollo/client";

import { split, HttpLink } from "@apollo/client";
// import { getMainDefinition } from "@apollo/client/utilities";
// import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: "http://localhost:3000/api/graphql",
});

// const wsLink = new GraphQLWsLink(
//   createClient({
//     url: "ws://localhost:3000/api/graphql",
//   })
// );

// // The split function takes three parameters:
// //
// // * A function that's called for each operation to execute
// // * The Link to use for an operation if the function returns a "truthy" value
// // * The Link to use for an operation if the function returns a "falsy" value
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   wsLink,
//   httpLink
// );

// ...code from the above example goes here...

export const apolloClient = new ApolloClient({
  // link: splitLink,
  // link: httpLink,
  uri: "http://localhost:3000/api/graphql",
  cache: new InMemoryCache(),
});
