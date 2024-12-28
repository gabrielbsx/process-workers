export type WorkerSlaveProtocol<T> = (
  fn: (data: T) => Promise<unknown>
) => Promise<void>;
