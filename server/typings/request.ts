import { Request } from "express";
import { ParamsDictionary, Query, Response, NextFunction, } from 'express-serve-static-core';

export interface TokenInfo {
  sub: string
  exp: number
  roles: string[]
}

export interface SRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
  > extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  userId?: number
  tokenInfo?: TokenInfo
}

export type RequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query,
  Locals extends Record<string, any> = Record<string, any>
  > = (
    req: SRequest<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction,
  ) => void;
