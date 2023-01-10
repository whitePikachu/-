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
    if (user.jurisdiction === 3) {
      throw new BadRequestException('账号已被封禁')
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
  //验证权限
  async checkPermissions(id: number) {
    const data = await this.prisma.auth.findUnique({
      where: {
        auth_id: id,
      },
      select: {
        jurisdiction: true,
      },
    })
    switch (data?.jurisdiction) {
      case 0:
        return { cod: 200, msg: '普通用户' }
      case 1:
        return { cod: 200, msg: '管理员' }
      case 2:
        return { cod: 200, msg: '超级管理员' }
      case 3:
        return { cod: 200, msg: '封禁' }
      default:
        return { cod: 200, msg: '普通用户' }
    }
  }
  //统计用户数
  async count() {
    //最新用户
    const newuser = await this.prisma.userinfo.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        user: {
          select: {
            username: true,
          },
        },
      },
    })
    return {
      cod: 200,
      msg: '查询成功',
      data: {
        newuser: newuser.user.username,
        count: await this.prisma.auth.count(),
      },
    }
  }
}
