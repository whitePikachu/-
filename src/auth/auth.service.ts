import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { auth } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import LoginDto from './dto/login.dto'
import registerDto from './dto/register.dto'
import UpsetpawDto from './dto/upsetpaw.dto'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async register(dto: registerDto) {
    const paw = await hash(dto.paw)
    const user = await this.prisma.auth.create({
      data: {
        username: dto.name,
        password: paw,
        email: dto.emali,
        user: {
          create: {
            avatar: '',
          },
        },
      },
    })
    delete user.password
    const token = await this.token(user)
    return { cod: 200, msg: '注册成功', token }
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.auth.findUnique({
      where: {
        username: dto.name,
      },
    })
    if (!user) {
      throw new BadRequestException('用户名错误')
    }
    if (!(await verify(user.password, dto.paw))) {
      throw new BadRequestException('密码错误')
    }
    delete user.password
    const token = await this.token(user)
    return { cod: 200, msg: '登陆成功', token }
  }
  //修改密码
  async paw(id: number, dto: UpsetpawDto) {
    const user = await this.prisma.auth.findUnique({
      where: {
        auth_id: id,
      },
    })
    if (!user) {
      throw new BadRequestException('用户名错误')
    }
    if (!(await verify(user.password, dto.paw))) {
      throw new BadRequestException('密码错误')
    }
    const paw = await hash(dto.newpaw)
    await this.prisma.auth.update({
      where: {
        auth_id: id,
      },
      data: {
        password: paw,
      },
    })
    return { cod: 200, msg: '修改成功' }
  }
  async token({ auth_id, username }: auth) {
    const token = await this.jwt.signAsync({
      username,
      sub: auth_id,
    })
    return token
  }
}
