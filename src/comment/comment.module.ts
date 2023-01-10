import { Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { UserinfoService } from '@/userinfo/userinfo.service'

@Module({
  imports: [],
  controllers: [CommentController],
  providers: [CommentService, UserinfoService],
})
export class CommentModule {}
