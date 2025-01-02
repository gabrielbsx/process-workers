export type LogType = "info" | "error" | "warn" | "debug";

export type LogArgs<T> = {
  message: string;
  data?: T;
  context?: unknown;
};

export interface LoggerProtocol {
  log: (args: LogArgs<unknown>) => void;
  warn: (args: LogArgs<unknown>) => void;
  error: (args: LogArgs<unknown>) => void;
  info: (args: LogArgs<unknown>) => void;
}
