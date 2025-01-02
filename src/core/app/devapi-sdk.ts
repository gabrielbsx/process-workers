import { ApiProtocol } from "@/core/protocols/api.protocol";
import { LoggerProtocol } from "@/core/protocols/logger.protocol";
import { AxiosApiImpl } from "@/shell/implementation/axios-api.impl";
import { ConsumePlanApiDecorator } from "@/shell/implementation/consume-plan-api.impl";
import { PinoLoggerImpl } from "@/shell/implementation/pino-logger.impl";
import { FormatDateProtocol } from "../protocols/format-date.protocol";
import { dayJsFormatDate } from "@/shell/implementation/dayjs-format-date.impl";
import { CacheProtocol } from "../protocols/cache.protocol";
import { RedisCacheImpl } from "@/shell/implementation/redis-cache.impl";
import { QueueProtocol } from "../protocols/queue.protocol";
import { RedisQueueImpl } from "@/shell/implementation/redis-queue.impl";

export class DevApiSDK {
  private static _api: ApiProtocol;
  private static _logger: LoggerProtocol;
  private static _formatDate: FormatDateProtocol;
  private static _cache: CacheProtocol;
  private static _queue: QueueProtocol;

  static KEEP_PAGINATE = {
    hasNext: true,
  } as const;

  static STOP_PAGINATE = {
    hasNext: false,
  } as const;

  static bootstrap() {
    return new DevApiSDK();
  }

  static get api() {
    if (!DevApiSDK._api) {
      DevApiSDK._api = new ConsumePlanApiDecorator(
        new AxiosApiImpl(),
        DevApiSDK.logger
      );
    }

    return DevApiSDK._api;
  }

  static get logger() {
    if (!DevApiSDK._logger) {
      DevApiSDK._logger = new PinoLoggerImpl();
    }

    return DevApiSDK._logger;
  }

  static get formatDate() {
    if (!DevApiSDK._formatDate) {
      DevApiSDK._formatDate = dayJsFormatDate;
    }

    return DevApiSDK._formatDate;
  }

  static get cache() {
    if (!DevApiSDK._cache) {
      DevApiSDK._cache = new RedisCacheImpl();
    }

    return DevApiSDK._cache;
  }

  static get queue() {
    if (!DevApiSDK._queue) {
      DevApiSDK._queue = new RedisQueueImpl();
    }

    return DevApiSDK._queue;
  }

  static async paginate(
    fn: (page: number, limit: number) => Promise<{ hasNext: boolean }>,
    page = 1,
    limit = 50
  ) {
    const { hasNext } = await fn(page, limit);

    if (hasNext) {
      await this.paginate(fn, page + 1, limit);
    }
  }
}
