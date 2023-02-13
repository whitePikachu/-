import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { UserinfoService } from '@/userinfo/userinfo.service'
import { AdminService } from '@/admin/admin.service'

@Module({
  providers: [PostService, UserinfoService, AdminService],
  controllers: [PostController],
})
export class PostModule {}
