import { createServer } from "http";

import _ from 'module-alias/register.js'
import * as express from "express";

// routes
import userRouter from "@api/user";

// // middlewares
import commonMid from './middlewares/common.js'
import { SocketManager } from "./ws";
import { serverPort } from "./env";

const app = express();

app.set("port", serverPort);

// setup common middlewares
commonMid(app)

app.use("/users", userRouter);

/** Create HTTP server. */
const server = createServer(app);
/** Create socket connection */
export const socketManager = new SocketManager(server);

/** Listen on provided port, on all network interfaces. */
server.listen(serverPort);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
  console.log(`Listening on: http://localhost:${port}/`)
});
