import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseGuards, Req } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadImage } from './upload.decorator'
import { AuthGuard } from '@nestjs/passport'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('image')
  @UploadImage()
  image(@UploadedFile() file: Express.Multer.File) {
    return file
  }
  @Post('Avatar')
  @UseGuards(AuthGuard('jwt'))
  @UploadImage()
  async userLoadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return await this.uploadService.userLoadAvatar(req.user as number, file.path)
  }
}
