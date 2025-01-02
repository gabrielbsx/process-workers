import { DevApiException } from "@/core/domain/devapi.error";
import { Either } from "@/core/domain/either";
import {
  ApiProtocol,
  Request,
  Response,
  Result,
} from "@/core/protocols/api.protocol";
import axios, { AxiosError } from "axios";

type Method = "get" | "post" | "put" | "delete" | "patch";

export class AxiosApiImpl implements ApiProtocol {
  private request(method: Method, request: Request) {
    try {
      const response = axios.request({
        method,
        url: request.url,
        ...(method !== "get" ? { data: request.data } : {}),
        headers: request.headers,
        params: request.params,
      });

      return response;
    } catch (error) {
      const exception = new DevApiException(
        `Error on ${method} request: ${error}`
      );

      exception.treatment(error as AxiosError);

      throw exception;
    }
  }

  async get<T = unknown>(request: Request): Promise<Result<T>> {
    const maybeResponse = Either.handle<DevApiException, Response<T>>(() =>
      this.request("get", request)
    );

    return maybeResponse;
  }

  async post<T>(request: Request) {
    const maybeResponse = Either.handle<DevApiException, Response<T>>(() =>
      this.request("post", request)
    );

    return maybeResponse;
  }

  async put<T>(request: Request) {
    const maybeResponse = Either.handle<DevApiException, Response<T>>(() =>
      this.request("put", request)
    );

    return maybeResponse;
  }

  async delete<T>(request: Request) {
    const maybeResponse = Either.handle<DevApiException, Response<T>>(() =>
      this.request("delete", request)
    );

    return maybeResponse;
  }

  async patch<T>(request: Request) {
    const maybeResponse = Either.handle<DevApiException, Response<T>>(() =>
      this.request("patch", request)
    );

    return maybeResponse;
  }
}
