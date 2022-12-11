import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { Request } from 'express'
import { CodService } from './cod.service'

@Controller('cod')
export class CodController {
  constructor(private readonly codService: CodService) {}
  @Get('getcod')
  async getcod(@Req() req: Request) {
    return await this.codService.getCod(req.ip)
  }
  @Post('verifycod')
  async verifycod(@Req() req: Request, @Body() body: { cod: string }) {
    return await this.codService.verifyCod(req.ip, body.cod)
  }
}
