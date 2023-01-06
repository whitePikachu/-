import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidatePipe } from './Validate.pipe'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useStaticAssets('uploads', { prefix: '/uploads' })
  app.useGlobalPipes(new ValidatePipe())
  app.enableCors()
  await app.listen(3000)
}
bootstrap()
