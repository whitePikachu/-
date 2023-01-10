import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { UserinfoService } from '@/userinfo/userinfo.service'

@Module({
  providers: [PostService, UserinfoService],
  controllers: [PostController],
})
export class PostModule {}
