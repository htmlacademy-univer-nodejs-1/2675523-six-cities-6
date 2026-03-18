import {inject, injectable} from 'inversify';
import {Component} from '../shared/index.js';
import {LoggerInterface} from '../shared/libs/logger/models/index.js';
import {ConfigInterface, RestSchema} from '../shared/libs/config/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly _logger: LoggerInterface,
    @inject(Component.Config) private readonly _config: ConfigInterface<RestSchema>
  ) {
  }

  public async init(): Promise<void> {
    this._logger.info('REST application init');
    this._logger.info(`Get value from env $PORT: ${this._config.get('PORT')}`);
  }
}
