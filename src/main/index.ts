import { loadUsers } from "../core/app/load-users";
import { Input, processChunk } from "../core/app/process-chunk";
import { makeInvokeWorkers } from "../shell/implementation/invoke-workers.impl";

const main = async () => {
  const workerPath = __filename;
  const invokeWorkers = makeInvokeWorkers<Input>();

  await invokeWorkers(workerPath, loadUsers, processChunk);
};

main();
