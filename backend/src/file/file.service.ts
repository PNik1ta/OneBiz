import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { FileElementResponse } from './dto/file-element.response';
import { ensureDir, writeFile } from 'fs-extra';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { MFile } from '../shared/classes/mFile';

@Injectable()
export class FileService {
  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), 'yyyy-mm-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    await ensureDir(uploadFolder);

    const res: FileElementResponse[] = [];
    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({
        url: `${dateFolder}/${file.originalname}`,
        name: file.originalname,
      });
    }
    return res;
  }

  convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
