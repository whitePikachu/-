import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserinfoService } from './userinfo.service'
import { Request } from 'express'
import userDateDto from './dto/userinfo.dto'
import userInfoDto from './dto/user.dto'
@Controller('userinfo')
export class UserinfoController {
  constructor(private readonly userinfoService: UserinfoService) {}
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getinfo(@Req() req: Request) {
    return await this.userinfoService.getinfo(req.user as number)
  }
  @Get('getuser')
  async getuser(@Query('id') id: number) {
    if (id) {
      return await this.userinfoService.getinfo(+id)
    } else {
      return { cod: 400, message: '用户不存在' }
    }
  }
  @Put()
  @UseGuards(AuthGuard('jwt'))
  updateinfo(@Req() req: Request, @Body() data: userDateDto) {
    return this.userinfoService.updateinfo(req.user as number, data)
  }
  @Put('updateuserinfo')
  @UseGuards(AuthGuard('jwt'))
  updateuserinfo(@Req() req: Request, @Body() dto: userInfoDto) {
    return this.userinfoService.updateuserinfo(req.user as number, dto)
  }
}
