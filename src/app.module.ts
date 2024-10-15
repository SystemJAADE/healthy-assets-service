import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MinioClientModule } from './minio-client/minio-client.module';
import { AccountsModule } from './accounts/accounts.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        APP_HOST: Joi.string(),
        APP_PORT: Joi.number(),
        MINIO_HOST: Joi.string().required(),
        MINIO_PORT: Joi.number().required(),
        MINIO_ACCESS_KEY: Joi.string().required(),
        MINIO_SECRET_KEY: Joi.string().required(),
        AVATARS_BUCKET: Joi.string().required(),
        DEFAULT_AVATAR_FILENAME: Joi.string().required(),
      }),
    }),
    MinioClientModule,
    AccountsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
