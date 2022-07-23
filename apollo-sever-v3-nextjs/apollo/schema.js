import {
  typeDefs as scalerTypeDefs,
  resolvers as scalerResolvers,
} from "graphql-scalars";

import { resolvers, typeDefs } from "./resolvers";

export const schemaObject = {
  typeDefs: [...scalerTypeDefs, typeDefs],
  resolvers: [scalerResolvers, resolvers],
};
