import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserinfoService } from './userinfo.service'
import { Request } from 'express'
import userDateDto from './dto/userinfo.dto'
@Controller('userinfo')
export class UserinfoController {
  constructor(private readonly userinfoService: UserinfoService) {}
  @Get('getinfo')
  @UseGuards(AuthGuard('jwt'))
  async getinfo(@Req() req: Request) {
    return await this.userinfoService.getinfo(req.user as number)
  }
  @Post('updateinfo')
  @UseGuards(AuthGuard('jwt'))
  updateinfo(@Req() req: Request, @Body() data: userDateDto) {
    return this.userinfoService.updateinfo(req.user as number, data)
  }
}
