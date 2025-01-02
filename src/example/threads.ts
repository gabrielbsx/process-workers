import { chunkify } from "@/core/domain/chunkify";
import { loadUsers } from "./load-users";
import { Input, processChunk } from "./process-chunk";
import { makeInvokeWorkers } from "../shell/implementation/invoke-workers.impl";

const mainThreads = async () => {
  const workerPath = __filename;
  const invokeWorkers = makeInvokeWorkers<Input>();

  console.time("threads");
  const startCPU = process.cpuUsage();
  const startMemory = process.memoryUsage();

  await invokeWorkers(workerPath, loadUsers, processChunk);

  console.timeEnd("threads");
  const elapsedCPU = process.cpuUsage(startCPU);
  const elapsedMemory = process.memoryUsage().heapUsed - startMemory.heapUsed;

  console.log("CPU time: ", elapsedCPU);
  console.log("Memory used: ", elapsedMemory);

  const memoryDiff = {
    rss: process.memoryUsage().rss - startMemory.rss,
    heapTotal: process.memoryUsage().heapTotal - startMemory.heapTotal,
    heapUsed: process.memoryUsage().heapUsed - startMemory.heapUsed,
    external: process.memoryUsage().external - startMemory.external,
  };

  console.log("Memory diff: ", memoryDiff);
};

const mainConcurrent = async () => {
  const users = await loadUsers();
  const usersChunks = chunkify(users, 8000);

  console.time("concurrent");
  const startCPU = process.cpuUsage();
  const startMemory = process.memoryUsage();

  await Promise.all(usersChunks.map((chunk) => processChunk(chunk)));

  console.timeEnd("concurrent");
  const elapsedCPU = process.cpuUsage(startCPU);
  const elapsedMemory = process.memoryUsage().heapUsed - startMemory.heapUsed;

  console.log("CPU time: ", elapsedCPU);
  console.log("Memory used: ", elapsedMemory);

  const memoryDiff = {
    rss: process.memoryUsage().rss - startMemory.rss,
    heapTotal: process.memoryUsage().heapTotal - startMemory.heapTotal,
    heapUsed: process.memoryUsage().heapUsed - startMemory.heapUsed,
    external: process.memoryUsage().external - startMemory.external,
  };

  console.log("Memory diff: ", memoryDiff);
};

const sequential = async () => {
  const users = await loadUsers();
  const usersChunks = chunkify(users, 8000);

  console.time("sequential");
  const startCPU = process.cpuUsage();
  const startMemory = process.memoryUsage();

  for (const chunk of usersChunks) {
    await processChunk(chunk);
  }

  console.timeEnd("sequential");
  const elapsedCPU = process.cpuUsage(startCPU);
  const elapsedMemory = process.memoryUsage().heapUsed - startMemory.heapUsed;

  console.log("CPU time: ", elapsedCPU);
  console.log("Memory used: ", elapsedMemory);

  const memoryDiff = {
    rss: process.memoryUsage().rss - startMemory.rss,
    heapTotal: process.memoryUsage().heapTotal - startMemory.heapTotal,
    heapUsed: process.memoryUsage().heapUsed - startMemory.heapUsed,
    external: process.memoryUsage().external - startMemory.external,
  };

  console.log("Memory diff: ", memoryDiff);
};

// the threads are 3900% faster than concurrent, or 40x faster
mainThreads();
mainConcurrent();
sequential();
