import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { unlinkSync } from 'fs'
import { resolve } from 'path'

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}
  async userLoadAvatar(id: number, path: string) {
    const oldAvatar = await this.prisma.userinfo.findUnique({
      where: {
        authId: id,
      },
    })
    let url = oldAvatar.avatar
    if (url) {
      unlinkSync(resolve() + '/' + url)
    }
    await this.prisma.userinfo.update({
      where: {
        authId: id,
      },
      data: {
        avatar: path,
      },
    })
    return {
      msg: '上传头像成功！',
      Date: path,
    }
  }
}
