export interface QueueProtocol {
  enqueue<T>(key: string, data: T): Promise<void>;
  dequeue<T>(key: string): Promise<T>;
  peek<T>(key: string): Promise<T | null>;
  remove<T>(key: string, data: T): Promise<void>;
  size(key: string): Promise<number>;
  isEmpty(key: string): Promise<boolean>;
  clear(key: string): Promise<void>;
}
