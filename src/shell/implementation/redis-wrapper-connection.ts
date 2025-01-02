import { createClient, RedisClientType } from "redis";

export class RedisConnectionWrapper {
  private static client: RedisClientType | null = null;
  private static isConnected: boolean = false;

  static async getClient(): Promise<RedisClientType> {
    if (!RedisConnectionWrapper.client) {
      RedisConnectionWrapper.client = createClient({
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || "6379"),
        },
        password: process.env.REDIS_PASSWORD,
      });

      RedisConnectionWrapper.client.on("error", (err) => {
        console.error("Erro no Redis:", err);
      });

      RedisConnectionWrapper.client.on("connect", () => {
        RedisConnectionWrapper.isConnected = true;
        console.log("Conectado ao Redis");
      });

      try {
        await RedisConnectionWrapper.client.connect();
        RedisConnectionWrapper.isConnected = true;
      } catch (err) {
        console.error("Erro ao conectar ao Redis:", err);
        RedisConnectionWrapper.isConnected = false;
        throw err;
      }
    } else if (!RedisConnectionWrapper.isConnected) {
      try {
        await RedisConnectionWrapper.client.connect();
        RedisConnectionWrapper.isConnected = true;
      } catch (err) {
        console.error("Erro ao reconectar ao Redis:", err);
        throw err;
      }
    }

    return RedisConnectionWrapper.client;
  }
}
