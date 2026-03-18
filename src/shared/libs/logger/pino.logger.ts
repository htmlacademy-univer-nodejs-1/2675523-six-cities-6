import {resolve} from 'node:path';
import {
  DestinationStream as PinoDestinationStream,
  Logger as PinoInstanse,
  pino,
  transport
} from 'pino';
import {getCurrentModuleDirectoryPath} from '../../helpers/index.js';
import {injectable} from 'inversify';
import {LoggerInterface} from './models/index.js';

@injectable()
export class PinoLogger implements LoggerInterface {
  private readonly logger: PinoInstanse;

  constructor() {
    const modulePath = getCurrentModuleDirectoryPath();
    const logFilePath = 'logs/rest.log';
    const destination = resolve(modulePath, '../../../', logFilePath);

    const multiTransport: PinoDestinationStream = transport({
      targets: [
        {
          target: 'pino/file',
          options: {destination},
          level: 'debug'
        },
        {
          target: 'pino/file',
          options: {},
          level: 'info'
        }
      ]
    });

    this.logger = pino({}, multiTransport);
    this.logger.info('Logger created...');
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public error(message: string, error: Error): void {
    this.logger.error(error, message);
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }
}
