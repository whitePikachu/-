import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { PlateService } from './plate.service'

@Controller('plate')
export class PlateController {
  constructor(private readonly postService: PlateService) {}
  @Post('addolate')
  async addplate(@Body() { plate }) {
    return await this.postService.addplate(plate)
  }
  @Get('getplate')
  async getplate() {
    return await this.postService.getplate()
  }
  @Delete('deleteplate')
  async deleteplate(@Body() body) {
    return await this.postService.deleteplate(body.plateid)
  }
  @Put('updateplate')
  async updateplate(@Body() { plateid, plate }) {
    return await this.postService.updateplate(plateid, plate)
  }
}
