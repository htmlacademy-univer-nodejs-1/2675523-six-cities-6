export interface LoggerInterface {
  info(message: string): void;
  warn(message: string): void;
  error(message: string, error: Error): void;
  debug(message: string): void;
}
