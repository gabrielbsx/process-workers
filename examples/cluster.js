const cluster = require("cluster");
const { handleSlave } = require("./slave");
const { response } = require("./responses");
const { chunkArray } = require("./chunk");

const promiseChunk = (chunk, index) => {
  return new Promise((resolve, reject) => {
    const worker = cluster.fork();

    worker.once("online", () => {
      worker.send(chunk);
    });

    worker.once("message", (result) => {
      console.log(
        `Master recebeu resultado do worker ${worker.process.pid} (chunk #${index}):`,
        result
      );

      resolve(result);
    });

    worker.once("error", (err) => {
      reject(err);
    });

    worker.once("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker saiu com código de erro: ${code}`));
      }
    });
  });
};

const master = async () => {
  if (cluster.isPrimary) {
    const chunkSize = 5;
    const chunks = chunkArray(response, chunkSize);

    const promises = chunks.map(promiseChunk);

    try {
      const results = await Promise.all(promises);

      const resultsFlat = results.flat();

      return resultsFlat;
    } catch (err) {
      console.error(err);
    } finally {
      process.exit(0);
    }
  }

  process.on("message", async (chunk) =>
    process.send(await handleSlave(chunk))
  );
};

master();
