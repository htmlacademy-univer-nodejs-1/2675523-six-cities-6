import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';
import {MiddlewareInterface} from './models/middleware.interface.js';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private readonly uploadDirectory: string,
    private readonly fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${fileExtension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({ storage })
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
