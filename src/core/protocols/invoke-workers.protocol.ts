export type InvokeWorkers<T> = (
  workerPath: string,
  loadChunks: () => Promise<T[]>,
  processChunk: (chunk: T[]) => Promise<unknown>
) => Promise<void>;
