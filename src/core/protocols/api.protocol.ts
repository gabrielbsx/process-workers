import { DevApiException } from "../domain/devapi.error";
import { Either } from "../domain/either";

export type Request = {
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
};

export type Response<T> = {
  data: T;
  status: number;
};

export type Result<T> = Either<DevApiException, Response<T>>;

export interface ApiProtocol {
  get: <T>(request: Request) => Promise<Result<T>>;
  post: <T>(request: Request) => Promise<Result<T>>;
  put: <T>(request: Request) => Promise<Result<T>>;
  delete: <T>(request: Request) => Promise<Result<T>>;
  patch: <T>(request: Request) => Promise<Result<T>>;
}
