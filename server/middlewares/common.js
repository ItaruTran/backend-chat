const compression = require("compression");
const {
  xssFilter,
  frameguard,
  hsts,
  hidePoweredBy,
  ieNoOpen,
  noSniff,
} = require("helmet");
const express = require('express')
const cors = require('cors');
const { allowOrgins } = require("@sv/env");

/**
 * @param {express.Express} app
 */
module.exports = function (app) {
  app.use(compression())
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(xssFilter())
  app.use(frameguard({
    action: 'deny',
  }))
  app.use(hsts({
    "maxAge": 0,
    "includeSubDomains": true
  }))
  app.use(hidePoweredBy())
  app.use(ieNoOpen())
  app.use(noSniff())

  app.use(cors({
    origin: allowOrgins,
  }))
}
