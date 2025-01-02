const {
  Worker,
  isMainThread,
  workerData,
  parentPort,
} = require("worker_threads");
const { handleSlave } = require("./slave");
const { response } = require("./responses");
const { chunkArray } = require("./chunk");

const promiseChunk = (chunk, index) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: { chunk, index },
    });

    worker.on("message", (result) => {
      console.log(
        `\n[master] Worker #${worker.threadId} (chunk #${index}) retornou:`,
        result
      );
      resolve(result);
    });

    worker.on("error", (err) => {
      reject(err);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker saiu com código de erro: ${code}`));
      }
    });
  });
};

const master = async () => {
  if (isMainThread) {
    const chunkSize = 5;

    const chunks = chunkArray(response, chunkSize);

    try {
      console.time("Processamento");

      const promises = chunks.map(promiseChunk);

      const results = await Promise.all(promises);

      const final = results.flat();

      console.timeEnd("Processamento");
      console.log("\nResultados finais:", final);

      process.exit(0);
    } catch (err) {
      console.error("\nErro geral:", err);
      process.exit(1);
    }
  } else {
    const { chunk } = workerData;

    const response = await handleSlave(chunk);

    parentPort.postMessage(response);
  }
};

master();
