import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { PostService } from './post.service'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import searchPostDto from './dto/search.post.dto'
import { link } from 'fs'

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get('platelist')
  async getpostlist(@Query() { plateid, page, limit }) {
    if (page === undefined || limit === undefined) {
      return await this.postService.getpostlist(+plateid)
    }
    return await this.postService.getpostlist(+plateid, +page, +limit)
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
  @Get('getNewPost')
  async getNewPost(@Query('num') num: number) {
    return await this.postService.getNewPost(+num)
  }
  // 搜索帖子
  @Get('search')
  async search(@Query() dto: searchPostDto) {
    return await this.postService.searchPost(dto.title)
  }
  //根据用户id获取帖子
  @Get('getpostbyuserid')
  @UseGuards(AuthGuard('jwt'))
  async getpostbyuserid(@Req() req: Request, @Query() { link, page }) {
    return await this.postService.getPostByUserId(req.user as number, page, link)
  }
}
