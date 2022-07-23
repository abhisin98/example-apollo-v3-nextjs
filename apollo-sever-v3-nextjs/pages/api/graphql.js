import { ApolloServer } from "apollo-server-micro";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import Cors from "micro-cors";
import { WebSocketServer } from "ws";
import { schemaObject } from "../../apollo/schema";

const schema = makeExecutableSchema(schemaObject);
const cors = Cors();
let serverCleanup = null;

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        console.log("Apollo Server - ", "Apollo server Will Start");
        return {
          async drainServer() {
            console.log("drainServer");
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});
const startServer = apolloServer.start();

export default cors(async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );

  if (res.socket.server.ws) {
    // console.log("WebSocket - ", "Socket is already running");
  } else {
    console.log("WebSocket - ", "Socket is initializing");
    const wsServer = new WebSocketServer({
      server: res.socket.server,
      path: "/api/graphql",
    });
    serverCleanup = useServer(
      {
        schema,
        onConnect: async (ctx) => {
          console.log("WebSocket - ", "Client Connects");
        },
        onDisconnect(ctx, code, reason) {
          console.log("WebSocket - ", "Client Disconnected!");
        },
      },
      wsServer
    );
    res.socket.server.ws = wsServer;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
  res.end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};
