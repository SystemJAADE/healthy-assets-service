import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MinioClientModule],
  providers: [AccountsService, ConfigService],
  exports: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
