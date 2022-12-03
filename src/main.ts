import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidatePipe } from './Validate.pipe'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidatePipe())
  await app.listen(3000)
}
bootstrap()
