import { AxiosError } from "axios";

export class DevApiException extends Error {
  status: number | undefined;
  request: AxiosError["request"] | undefined;
  response: AxiosError["response"] | undefined;

  constructor(message?: string) {
    super(message);
  }

  treatment(error: AxiosError) {
    this.status = error.response?.status;
    this.request = error.request;
    this.response = error.response;
    this.cause = error.cause;
    this.stack = error.stack;
    this.message = error.message;
    this.name = error.name;
  }
}
