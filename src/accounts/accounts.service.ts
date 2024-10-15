/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import * as stream from 'node:stream';
import { BufferedImageDto } from 'src/minio-client/dto/buffered-image.dto';
import { join } from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    private minioClientService: MinioClientService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const defaultAvatarFilename = this.configService.get(
      'DEFAULT_AVATAR_FILENAME',
    );
    const defaultAvatarPath = join(
      __dirname,
      '..',
      'assets',
      `${defaultAvatarFilename}.png`,
    );

    try {
      await this.minioClientService.getAvatar(defaultAvatarFilename);
      this.logger.log('Default avatar already exists in MinIO. Skipping...');
    } catch (error) {
      const imageBuffer = await fs.promises.readFile(defaultAvatarPath);
      const imageStats = await fs.promises.stat(defaultAvatarPath);

      const imageDto: BufferedImageDto = {
        buffer: imageBuffer,
        mimetype: 'image/png',
        size: imageStats.size,
        fieldname: 'image',
        originalname: defaultAvatarFilename,
        encoding: '7bit',
      };

      await this.uploadAvatar(defaultAvatarFilename, imageDto);
      this.logger.log('Default avatar uploaded to MinIO.');
    }
  }

  async getAvatar(id: string): Promise<stream.Readable> {
    return await this.minioClientService.getAvatar(id);
  }

  async uploadAvatar(id: string, imageDto: BufferedImageDto) {
    const uploadedImage = await this.minioClientService.uploadImage(
      id,
      imageDto,
    );

    return {
      filename: uploadedImage.filename,
      image_url: uploadedImage.url,
      message: 'Successfully uploaded to MinIO S3/AWS S3',
    };
  }
}
