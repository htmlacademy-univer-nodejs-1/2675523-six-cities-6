import { createWriteStream, WriteStream } from 'node:fs';
import { FileWriterInterface } from './models/file-writer.interface.js';

export class TSVFileWriter implements FileWriterInterface {
  private readonly stream: WriteStream;

  constructor(filName: string) {
    this.stream = createWriteStream(filName, {
      flags: 'w',
      encoding: 'utf-8',
      autoClose: true
    });
  }

  public async write(row: string): Promise<unknown> {
    const writeSuccess = this.stream.write(`${row}\n`);
    if (!writeSuccess) {
      return new Promise((resolve) =>
        this.stream.once('drain', () => resolve(true))
      );
    }

    return Promise.resolve();
  }
}
