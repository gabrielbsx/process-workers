import { readFileSync } from "node:fs";
import { Input } from "./process-chunk";

export const loadUsers = async () => {
  const mockPath = __dirname + "/../../main/mocks/users.json";

  const input = JSON.parse(readFileSync(mockPath).toString()) as Input[];

  return input;
};
