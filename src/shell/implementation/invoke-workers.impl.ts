import { chunkify } from "../../core/domain/chunkify";
import { makeWorkerMaster } from "./worker-master.impl";
import { InvokeWorkers } from "../../core/protocols/invoke-workers.protocol";
import { makeWorkerSlave } from "./worker-slave.impl";
import { isMainThread } from "node:worker_threads";
import os from "os";

export const makeInvokeWorkers = <T = unknown>(): InvokeWorkers<T> => {
  return async (workerPath, loadChunks, processChunk) => {
    if (isMainThread) {
      const input = await loadChunks();

      const chunks = chunkify(input, os.availableParallelism());

      console.log(
        `Total chunks: ${chunks.length} com + ou - ${chunks[0].length} elementos cada, totalizando ${input.length} elementos`
      );

      const workerMaster = makeWorkerMaster<T[], unknown>(workerPath!);

      await Promise.all(chunks.map((chunk) => workerMaster(chunk)));
    } else {
      const workerSlave = makeWorkerSlave<T[]>();

      await workerSlave(processChunk);
    }
  };
};
