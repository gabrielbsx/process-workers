import { QueueProtocol } from "@/core/protocols/queue.protocol";
import { RedisConnectionWrapper } from "./redis-wrapper-connection";

export class RedisQueueImpl implements QueueProtocol {
  async enqueue<T>(key: string, data: T): Promise<void> {
    try {
      const serializedData = JSON.stringify(data);

      const redisClient = await RedisConnectionWrapper.getClient();

      await redisClient.rPush(key, serializedData);
    } catch (error) {
      console.error(`Erro ao adicionar à fila "${key}":`, error);
      throw error;
    }
  }

  async peek<T>(key: string): Promise<T | null> {
    try {
      const redisClient = await RedisConnectionWrapper.getClient();

      const serializedData = await redisClient.lIndex(key, 0);

      if (!serializedData) {
        return null;
      }

      return JSON.parse(serializedData);
    } catch (error) {
      console.error(
        `Erro ao visualizar o próximo item da fila "${key}":`,
        error
      );
      throw error;
    }
  }

  async remove<T>(key: string, data: T): Promise<void> {
    try {
      const serializedData = JSON.stringify(data);

      const redisClient = await RedisConnectionWrapper.getClient();

      await redisClient.lRem(key, 1, serializedData);
    } catch (error) {
      console.error(`Erro ao remover item da fila "${key}":`, error);
      throw error;
    }
  }

  async dequeue<T>(key: string): Promise<T> {
    try {
      const redisClient = await RedisConnectionWrapper.getClient();

      const serializedData = await redisClient.lPop(key);

      if (!serializedData) {
        throw new Error("Empty queue");
      }

      return JSON.parse(serializedData);
    } catch (error) {
      console.error(`Erro ao remover da fila "${key}":`, error);
      throw error;
    }
  }

  async size(key: string): Promise<number> {
    try {
      const redisClient = await RedisConnectionWrapper.getClient();

      return redisClient.lLen(key);
    } catch (error) {
      console.error(`Erro ao obter o tamanho da fila "${key}":`, error);
      throw error;
    }
  }

  async isEmpty(key: string): Promise<boolean> {
    try {
      const redisClient = await RedisConnectionWrapper.getClient();

      return (await redisClient.lLen(key)) === 0;
    } catch (error) {
      console.error(`Erro ao verificar se a fila "${key}" está vazia:`, error);
      throw error;
    }
  }

  async clear(key: string): Promise<void> {
    try {
      const redisClient = await RedisConnectionWrapper.getClient();

      await redisClient.del(key);
    } catch (error) {
      console.error(`Erro ao limpar a fila "${key}":`, error);
      throw error;
    }
  }
}
