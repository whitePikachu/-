import { CodService } from '@/cod/cod.service'
import { Body, Controller, Get, Headers, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { AuthService } from './auth.service'
import LoginDto from './dto/login.dto'
import registerDto from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private auto: AuthService, private readonly codService: CodService) {}
  @Post('register')
  async register(@Body() dto: registerDto, @Req() req: Request, @Headers() headers: any) {
    const rescod = await this.codService.verifyCod(req.ip, headers.cod)
    if (!rescod.status) {
      return rescod
    }
    return await this.auto.register(dto)
  }
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auto.login(dto)
  }
  @Get('islogin')
  @UseGuards(AuthGuard('jwt'))
  islogin(@Req() req: Request) {
    return true
  }
}
