import { Worker } from "node:worker_threads";
import { WorkerMasterProtocol } from "../../core/protocols/worker-master.protocol";

export const makeWorkerMaster = <T, U>(
  workerPath: string
): WorkerMasterProtocol<T, U> => {
  return (input: T) => {
    return new Promise((resolve, reject) => {
      const loader = "./src/main/dev-resolver.mjs";

      const worker = new Worker(loader, {
        workerData: {
          scriptPath: workerPath,
        },
      });

      worker.postMessage(input);

      worker.on("message", (output: U) => resolve(output));
      worker.on("error", (err) => reject(err));
      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker finalizou com erro: ${code}`));
        }
      });
    });
  };
};
