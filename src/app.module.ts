import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@/auth/auth.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { CodModule } from './cod/cod.module';
import { RedisModule } from './redis/redis.module';
import { UserinfoModule } from './userinfo/userinfo.module';
import { PostModule } from './post/post.module';
import { PlateModule } from './plate/plate.module';
import { UploadModule } from './upload/upload.module';
import { CommentModule } from './comment/comment.module';
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CodModule,
    RedisModule,
    UserinfoModule,
    PostModule,
    PlateModule,
    UploadModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
