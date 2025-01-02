import { Either } from "../domain/either";

export interface CacheProtocol {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  execute<L, R>(
    key: string,
    callback: () => Promise<Either<L, R>>,
    extractValue?: (value: R) => unknown
  ): Promise<Either<L, R>>;
}
