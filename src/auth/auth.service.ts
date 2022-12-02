import { BadRequestException, Injectable } from '@nestjs/common'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import LoginDto from './dto/login.dto'
import registerDto from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async register(dto: registerDto) {
    const paw = await hash(dto.paw)
    const user = await this.prisma.user.create({
      data: {
        username: dto.name,
        password: paw,
        email: dto.emali,
      },
    })
    delete user.password
    return user
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.name,
      },
    })
    if (!user) {
      throw new BadRequestException('用户名错误')
    }
    if (!verify(user.password, dto.paw)) {
      throw new BadRequestException('密码错误')
    }
    delete user.password
    return user
  }
}
