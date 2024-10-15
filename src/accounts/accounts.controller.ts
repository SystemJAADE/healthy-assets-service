import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AccountsService } from './accounts.service';
import { BufferedImageDto } from 'src/minio-client/dto/buffered-image.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get(':id/avatar')
  async getAvatar(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const avatar = await this.accountsService.getAvatar(id);
    res.header('Content-Type', 'image/png');
    return new StreamableFile(avatar);
  }

  @Post(':id/avatar/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() image: BufferedImageDto,
  ) {
    return await this.accountsService.uploadAvatar(id, image);
  }
}
