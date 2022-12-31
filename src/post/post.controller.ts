import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { PostService } from './post.service'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get('platelist')
  async getpostlist(@Query('plateid') plateid: number) {
    return await this.postService.getpostlist(+plateid)
  }
  @Get()
  async getpost(@Query('id') id: number) {
    return await this.postService.getpost(+id)
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async post(@Req() req: Request, @Body() { title, content, plateid }) {
    return await this.postService.post(req.user as number, plateid, { title, content })
  }
  @Delete()
  async delete(@Query('postid') postid: number) {
    return await this.postService.delete(+postid)
  }
  @Put()
  async updated(@Body() { postid, title, content, plateId }) {
    return await this.postService.updated(+postid, { title, content, plateId })
  }
}
