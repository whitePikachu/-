import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { CodService } from './cod.service'

@Controller('cod')
export class CodController {
  constructor(private readonly codService: CodService) {}
  @Get('getcod')
  async getcod(@Req() req: Request) {
    return await this.codService.getCod(req.ip)
  }
}
