'use strict';
const { createServer } = require("http");
const { readdirSync } = require('fs')

require('module-alias/register.js')
const express = require("express");

// routes
const apiRouter = require("@api/index");

// // middlewares
const commonMid = require('./middlewares/common.js')
const notFound = require('./middlewares/not-found')
const { socketManager } = require("./ws");
const { serverPort } = require("./env");

main()

async function main() {
  const app = express();

  app.set("port", serverPort);

  // setup common middlewares
  commonMid(app)

  app.use("/api", apiRouter);

  notFound(app)

  for (const file of readdirSync('./server/boot')) {
    if (file.endsWith('.js')) {
      const func = require(`@sv/boot/${file}`)
      await func(app)
    }
  }

  /** Create HTTP server. */
  const server = createServer(app);
  /** Create socket connection */
  socketManager.init(server);

  /** Listen on provided port, on all network interfaces. */
  server.listen(serverPort);
  /** Event listener for HTTP server "listening" event. */
  server.on("listening", () => {
    console.log(`Listening on: http://localhost:${serverPort}/`)
  });
}
