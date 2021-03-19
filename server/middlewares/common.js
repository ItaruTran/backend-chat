import compression from "compression";
import {
  xssFilter,
  frameguard,
  hsts,
  hidePoweredBy,
  ieNoOpen,
  noSniff,
  noCache, } from "helmet";
import * as express from 'express'

/**
 * @param {express.Express} app
 */
export default function (app) {
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
  app.use(noCache())

  /** catch 404 and forward to error handler */
  app.use('*', (req, res) => {
    return res.status(404).json({
      success: false,
      message: 'API endpoint doesnt exist'
    })
  });

}
