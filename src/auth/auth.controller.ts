import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { AuthService } from './auth.service'
import LoginDto from './dto/login.dto'
import registerDto from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private auto: AuthService) {}
  @Post('register')
  register(@Body() dto: registerDto) {
    return this.auto.register(dto)
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
