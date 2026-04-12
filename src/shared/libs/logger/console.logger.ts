import chalk from 'chalk';
import { getErrorMessage } from '../../helpers/index.js';
import {LoggerInterface} from './models/index.js';

export class ConsoleLogger implements LoggerInterface {
  public info(message: string): void {
    console.info(chalk.green(message));
  }

  public warn(message: string): void {
    console.warn(chalk.yellow(message));
  }

  public error(message: string, error: Error): void {
    console.error(chalk.red(message));
    console.error(chalk.red(`Error message: ${getErrorMessage(error)}`));
  }

  public debug(message: string): void {
    console.debug(chalk.blue(message));
  }
}
