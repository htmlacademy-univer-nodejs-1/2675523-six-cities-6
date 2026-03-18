import {config, DotenvConfigOutput} from 'dotenv';
import {inject, injectable} from 'inversify';
import {ConfigInterface, RestSchema} from './models/index.js';
import {Component} from '../../models/index.js';
import {LoggerInterface} from '../logger/models/index.js';
import {configRestSchema} from './rest.shema.js';

@injectable()
export class RestConfig implements ConfigInterface<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    @inject(Component.Logger) private readonly logger: LoggerInterface
  ) {
    const parsedOutput: DotenvConfigOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configRestSchema.load({});
    configRestSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
