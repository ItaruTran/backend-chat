import { MultipartFile } from "@fastify/multipart";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyBaseLogger, FastifySchema, RouteShorthandOptionsWithHandler } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { IncomingMessage, Server, ServerResponse } from "http";
import { Transaction } from "sequelize";
import { TokenInfo } from "./auth";

export interface Handler<T> extends RouteShorthandOptionsWithHandler<
  Server,
  IncomingMessage,
  ServerResponse,
  RouteGenericInterface,
  any,
  T & FastifySchema,
  TypeBoxTypeProvider,
  FastifyBaseLogger
> {
  withTransaction?: boolean
}

declare module "fastify" {
  interface FastifyRequest {
    transaction: Transaction
    userId?: string
    tokenInfo?: TokenInfo;
    fileFields?: MultipartFile | MultipartFile[]
  }
}