import { ApiProtocol, Request, Result } from "@/core/protocols/api.protocol";
import { LoggerProtocol } from "@/core/protocols/logger.protocol";
import axios from "axios";

export class ConsumePlanApiDecorator implements ApiProtocol {
  constructor(
    private readonly _api: ApiProtocol,
    private readonly _logger: LoggerProtocol
  ) {}

  private async handleSuccess() {
    await axios.post(`${process.env.API_URL}/logs/response`, {
      log_id: process.env.LOG_ID,
      message: "OK",
      type: "SUCCESS",
    });
  }

  private async consumePlanApi<T>(
    request: Request,
    response: Result<T>
  ): Promise<void> {
    try {
      if (process.env.RUNNER) return;

      if (response.isRight()) {
        await this.handleSuccess();

        return;
      }

      const error = response.getLeft();

      const payloadError = {
        log_id: process.env.LOG_ID,
        status_code: error.status,
        message: error.message,
        config_error: {
          url: error.response?.config.url,
          method: error.response?.config.method,
          params: error.request?.params,
        },
        headers_error: error.response?.headers,
        data_error: JSON.stringify(error.response?.data),
        type: "ERROR",
      };

      await axios.post(`${process.env.API_URL}/logs/response`, payloadError);
    } catch (error) {
      this._logger.error({
        message: `Error consuming plan api ${
          (error as unknown as { message: string })?.message
        }`,
        context: "CONSUME_PLAN_API",
      });
    }
  }

  async get<T = unknown>(request: Request): Promise<Result<T>> {
    const response = await this._api.get<T>(request);

    await this.consumePlanApi(request, response);

    return response;
  }

  async post<T>(request: Request): Promise<Result<T>> {
    const response = await this._api.post<T>(request);

    await this.consumePlanApi(request, response);

    return response;
  }

  async put<T>(request: Request): Promise<Result<T>> {
    const response = await this._api.put<T>(request);

    await this.consumePlanApi(request, response);

    return response;
  }

  async delete<T>(request: Request): Promise<Result<T>> {
    const response = await this._api.delete<T>(request);

    await this.consumePlanApi(request, response);

    return response;
  }

  async patch<T>(request: Request): Promise<Result<T>> {
    const response = await this._api.patch<T>(request);

    await this.consumePlanApi(request, response);

    return response;
  }
}
