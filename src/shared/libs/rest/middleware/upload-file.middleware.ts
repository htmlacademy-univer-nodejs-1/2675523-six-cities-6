import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { nanoid } from 'nanoid';
import {MiddlewareInterface} from './models/middleware.interface.js';
import {HttpError} from '../errors/index.js';
import {StatusCodes} from 'http-status-codes';

const ALLOWED_IMAGE_MIME_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private readonly uploadDirectory: string,
    private readonly fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        this.resolveFileName(file.mimetype, callback);
      }
    });

    const uploadSingleFileMiddleware = multer({
      storage,
      fileFilter: (_req, file, callback) => {
        if (!this.isFileAllowed(file.mimetype)) {
          callback(new HttpError(
            StatusCodes.BAD_REQUEST,
            'Only .png and .jpg images are allowed',
            'UploadFileMiddleware',
          ));

          return;
        }

        callback(null, true);
      }
    })
      .single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }

  private resolveFileName(
    mimetype: string,
    callback: (error: Error | null, filename: string) => void
  ): void {
    const fileExtension = extension(mimetype);

    if (!fileExtension) {
      callback(new HttpError(
        StatusCodes.BAD_REQUEST,
        `Cannot resolve extension for mimetype ${mimetype}`,
        'UploadFileMiddleware',
      ), '');

      return;
    }

    callback(null, `${nanoid()}.${fileExtension}`);
  }

  private isFileAllowed(mimetype: string): boolean {
    return ALLOWED_IMAGE_MIME_TYPES.includes(mimetype);
  }
}
