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

export class SDK {
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
    return new SDK();
  }

  static get api() {
    if (!SDK._api) {
      SDK._api = new ConsumePlanApiDecorator(new AxiosApiImpl(), SDK.logger);
    }

    return SDK._api;
  }

  static get logger() {
    if (!SDK._logger) {
      SDK._logger = new PinoLoggerImpl();
    }

    return SDK._logger;
  }

  static get formatDate() {
    if (!SDK._formatDate) {
      SDK._formatDate = dayJsFormatDate;
    }

    return SDK._formatDate;
  }

  static get cache() {
    if (!SDK._cache) {
      SDK._cache = new RedisCacheImpl();
    }

    return SDK._cache;
  }

  static get queue() {
    if (!SDK._queue) {
      SDK._queue = new RedisQueueImpl();
    }

    return SDK._queue;
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
