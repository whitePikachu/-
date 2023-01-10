import { Module } from '@nestjs/common'
import { UserinfoService } from './userinfo.service'
import { UserinfoController } from './userinfo.controller'

@Module({
  providers: [UserinfoService],
  controllers: [UserinfoController],
  exports: [UserinfoService],
})
export class UserinfoModule {}
