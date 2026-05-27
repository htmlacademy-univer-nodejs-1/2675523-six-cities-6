import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CommandInterface } from './models/index.js';
import chalk from 'chalk';
import {getErrorMessage} from '../../shared/index.js';

type PackageJSONConfig = {
  version: string;
}

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

export class VersionCommand implements CommandInterface {
  constructor(
    private readonly filePath: string = './package.json'
  ) {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error(chalk.red('Failed to parse json content.'));
    }

    return importedContent.version;
  }

  public getName(): string {
    return '--version';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      this.printVersion(version);
    } catch (error: unknown) {
      this.printError(error);
    }
  }

  private printVersion(version: string): void {
    console.info(chalk.blue(version));
  }

  private printError(error: unknown): void {
    console.error(chalk.red(`Failed to read version from ${this.filePath}`));
    console.error(chalk.red(getErrorMessage(error)));
  }
}
