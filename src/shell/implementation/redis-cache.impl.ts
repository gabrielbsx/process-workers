import { Either } from "@/core/domain/either";
import { CacheProtocol } from "@/core/protocols/cache.protocol";
import { RedisConnectionWrapper } from "./redis-wrapper-connection";

export class RedisCacheImpl implements CacheProtocol {
  async get<T = unknown>(key: string) {
    try {
      const redisClient = await RedisConnectionWrapper.getClient();

      const value = await redisClient.get(key);

      if (!value) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Erro ao obter a chave "${key}":`, error);

      return null;
    }
  }

  async set<T = unknown>(key: string, value: T) {
    try {
      const redisClient = await RedisConnectionWrapper.getClient();

      const serializedValue = JSON.stringify(value);

      await redisClient.set(key, serializedValue);
    } catch (error) {
      console.error(`Erro ao definir a chave "${key}":`, error);
    }
  }

  async remove(key: string) {
    try {
      const redisClient = await RedisConnectionWrapper.getClient();

      await redisClient.del(key);
    } catch (error) {
      console.error(`Erro ao remover a chave "${key}":`, error);
    }
  }

  async execute<L, R>(
    key: string,
    callback: () => Promise<Either<L, R>>,
    extractValue?: (value: R) => unknown
  ): Promise<Either<L, R>> {
    const cachedValue = await this.get<R>(key);

    if (cachedValue) {
      console.log(`Cache hit para a chave "${key}"`);

      return Either.right(cachedValue);
    }

    const value = await callback();

    if (value.isLeft()) {
      return value;
    }

    await this.set(
      key,
      extractValue ? extractValue(value.getRight()) : value.getRight()
    );

    return value;
  }
}
