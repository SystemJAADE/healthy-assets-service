/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as stream from 'node:stream';
import { ConfigService } from '@nestjs/config';
import { BufferedImageDto } from './dto/buffered-image.dto';

@Injectable()
export class MinioClientService {
  private readonly baseAvatarsBucket: string;

  public get client() {
    return this.minio.client;
  }

  async getAvatar(filePath: string): Promise<stream.Readable> {
    if (filePath.includes('..') || filePath.includes('/')) {
      throw new HttpException('Invalid file path', HttpStatus.NOT_FOUND);
    }

    let downloadResponse: stream.Readable;

    try {
      downloadResponse = await this.client.getObject(
        this.baseAvatarsBucket,
        filePath,
      );
    } catch (error) {
      try {
        const defaultAvatar = this.configService.get('DEFAULT_AVATAR_FILENAME');
        downloadResponse = await this.client.getObject(
          this.baseAvatarsBucket,
          defaultAvatar,
        );
        return downloadResponse;
      } catch (error) {
        if (!downloadResponse) {
          throw new HttpException(
            'Default avatar is missing',
            HttpStatus.NOT_FOUND,
          );
        }
      }
      throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND);
    }

    return downloadResponse;
  }

  constructor(
    private readonly minio: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.baseAvatarsBucket = configService.get('AVATARS_BUCKET');
  }

  async uploadImage(
    filename: string,
    imageDto: BufferedImageDto,
    baseBucket: string = this.baseAvatarsBucket,
  ) {
    if (
      !(imageDto.mimetype.includes('jpeg') || imageDto.mimetype.includes('png'))
    ) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.client.putObject(
        baseBucket,
        filename,
        imageDto.buffer,
        imageDto.size,
      );
    } catch (error) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }

    return {
      url: `${this.configService.get(
        'MINIO_ENDPOINT',
      )}:${this.configService.get('MINIO_PORT')}/${this.configService.get(
        'AVATARS_BUCKET',
      )}/${filename}`,
      filename,
    };
  }

  async delete(
    objectName: string,
    baseBucket: string = this.baseAvatarsBucket,
  ) {
    await this.client.removeObject(baseBucket, objectName);
  }
}
