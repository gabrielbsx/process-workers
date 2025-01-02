import { LogArgs, LoggerProtocol } from "@/core/protocols/logger.protocol";
import pino from "pino";
import pinoPretty from "pino-pretty";

const logger = pino(pinoPretty());

export class PinoLoggerImpl implements LoggerProtocol {
  log<T>(args: LogArgs<T>) {
    return logger.info(args, args.message, args.data, args.context);
  }

  warn<T>(args: LogArgs<T>) {
    return logger.warn(args, args.message, args.data, args.context);
  }

  error<T>(args: LogArgs<T>) {
    return logger.error(args, args.message, args.data, args.context);
  }

  info<T>(args: LogArgs<T>) {
    return logger.info(args, args.message, args.data, args.context);
  }
}
