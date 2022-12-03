import { Global, Module } from '@nestjs/common'
import { CodService } from './cod.service'
import { CodController } from './cod.controller'

@Global()
@Module({
  providers: [CodService],
  controllers: [CodController],
  exports: [CodService],
})
export class CodModule {}
