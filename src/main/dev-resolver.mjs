import { register } from "tsx/esm/api";
import { workerData } from "node:worker_threads";
import { pathToFileURL } from "node:url";

register();

if (workerData.scriptPath) {
  const scriptUrl = pathToFileURL(workerData.scriptPath);
  await import(scriptUrl);
}
