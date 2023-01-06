import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { auth } from '@prisma/client'
import userDateDto from './dto/userinfo.dto'
import userInfoDto from './dto/user.dto'

@Injectable()
export class UserinfoService {
  constructor(private prisma: PrismaService) {}
  async getinfo(id: number) {
    const userinfo = await this.prisma.auth.findUnique({
      where: {
        auth_id: id,
      },
      include: {
        user: true,
      },
    })
    if (userinfo === null) {
      return { cod: 400, msg: '用户不存在' }
    }
    delete userinfo.auth_id
    delete userinfo.user.authId
    delete userinfo.password
    return { cod: 200, msg: '获取成功', data: { ...userinfo } }
  }
  async updateinfo(id: number, data: userDateDto) {
    const userinfo = await this.prisma.auth.findUnique({
      where: {
        auth_id: id,
      },
      include: {
        user: true,
      },
    })
    const user = await this.prisma.userinfo.update({
      where: {
        authId: userinfo.user.authId,
      },
      data: {
        avatar: data.avatar,
        exp: data.exp,
        level: data.level,
      },
    })
    return { cod: 200, msg: '修改成功', data: user }
  }
  async updateuserinfo(id: number, dto: userInfoDto) {
    const data = await this.prisma.userinfo.update({
      where: {
        authId: id,
      },
      data: {
        QQ: dto.QQ,
        nickname: dto.nickname,
        github: dto.github,
        signature: dto.signature,
      },
    })
    return { cod: 200, msg: '修改成功', data }
  }
}
