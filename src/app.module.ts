import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@/auth/auth.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { CodModule } from './cod/cod.module';
import { RedisModule } from './redis/redis.module';
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CodModule,
    RedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
