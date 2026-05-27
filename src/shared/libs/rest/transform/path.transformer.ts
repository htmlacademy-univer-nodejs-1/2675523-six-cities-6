import {inject, injectable} from 'inversify';
import {
  DEFAULT_STATIC_IMAGES,
  STATIC_RESOURCE_FIELDS
} from './consts/path-transformer.constant.js';
import {Component} from '../../../models/index.js';
import {LoggerInterface} from '../../logger/models/index.js';
import {ConfigInterface, RestSchema} from '../../config/index.js';
import {getFullServerPath} from '../../../helpers/index.js';
import {
  STATIC_FILES_ROUTE,
  STATIC_UPLOAD_ROUTE
} from '../../../../rest/index.js';


function isObject(value: unknown): value is Record<string, object> {
  return typeof value === 'object' && value !== null;
}

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Logger) private readonly logger: LoggerInterface,
    @inject(Component.Config) private readonly config: ConfigInterface<RestSchema>
  ) {
    this.logger.info('PathTransformer created');
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];
    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (isObject(value)) {
            stack.push(value);
            continue;
          }

          if (this.isStaticProperty(key) && typeof value === 'string') {
            current[key] = this.buildStaticResourcePath(value);
          }
        }
      }
    }

    return data;
  }

  private hasDefaultImage(value: string): boolean {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private isStaticProperty(property: string): boolean {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  private buildStaticResourcePath(value: string): string {
    return `${this.getServerPath()}${this.getResourceRoute(value)}/${value}`;
  }

  private getResourceRoute(value: string): string {
    return this.hasDefaultImage(value) ? STATIC_FILES_ROUTE : STATIC_UPLOAD_ROUTE;
  }

  private getServerPath(): string {
    return getFullServerPath(
      this.config.get('SERVER_HOST_PROTOCOL'),
      this.config.get('HOST'),
      this.config.get('PORT')
    );
  }
}
