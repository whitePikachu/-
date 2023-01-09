import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query, Put, Headers } from '@nestjs/common'
import { CommentService } from './comment.service'
import { AuthGuard } from '@nestjs/passport'
import { CodService } from '@/cod/cod.service'

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService, private readonly codService: CodService) {}

  @Get()
  async getComment(@Query('postId') postId: number, @Query('page') page: number, @Query('limit') limit: number) {
    if (page && limit && postId) {
      return this.commentService.getComment(+postId, +page, +limit)
    }
    return { status: 400, message: '参数错误' }
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createComment(@Req() req, @Body() body: any, @Headers('cod') cod: any) {
    const rescod = await this.codService.verifyCod(req.ip, cod)
    if (!rescod.status) {
      return rescod
    }
    const { content, postid } = body
    if (!content || !postid) {
      return { status: 400, message: '参数错误' }
    }
    return this.commentService.createComment(content, +postid, req.user as number)
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async deleteComment(@Req() req, @Body() body: any) {
    const { Commentid } = body
    if (!Commentid) {
      return { status: 400, message: '参数错误' }
    }
    return this.commentService.deleteComment(req.user as number, +Commentid)
  }
  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateComment(@Req() req, @Body() body: any) {
    const { Commentid, content } = body
    if (!Commentid || !content) {
      return { status: 400, message: '参数错误' }
    }
    return this.commentService.updateComment(req.user as number, +Commentid, content)
  }
}
