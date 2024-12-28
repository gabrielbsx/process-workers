import { WorkerSlaveProtocol } from "../../core/protocols/worker-slave.protocol";
import { parentPort, workerData } from "node:worker_threads";

export const makeWorkerSlave = <T>(): WorkerSlaveProtocol<T> => {
  return async (fn: (data: T) => Promise<unknown>) => {
    const initialData = workerData as T;

    parentPort?.postMessage(initialData);

    return new Promise((resolve, reject) => {
      parentPort?.on("message", async (newData: T) => {
        try {
          await fn(newData);

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  };
};
