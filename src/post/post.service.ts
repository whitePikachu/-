import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async post(authId: number, plateid: number, { title, content }) {
    return await this.prisma.post.create({
      data: {
        title,
        content,
        authorId: authId,
        plateId: plateid,
      },
    })
  }
  async updated(postid: number, { title, content, plateId }) {
    return await this.prisma.post.updateMany({
      where: {
        id: postid,
      },
      data: {
        title,
        content,
        plateId,
      },
    })
  }

  async delete(postid: number) {
    return await this.prisma.post.deleteMany({
      where: {
        id: postid,
      },
    })
  }

  async getpost(postid: number) {
    return await this.prisma.post.findUnique({
      where: {
        id: postid,
      },
      include: {
        author: true,
        plate: true,
        comment: true,
      },
    })
  }

  async getpostlist(plateid: number) {
    const data = await this.prisma.post.findMany({
      where: {
        plateId: plateid,
      },
      select: {
        id: true,
        title: true,
        authorId: true,
      },
    })
    data.map(async (item) => {
      const user = await this.prisma.auth.findUnique({
        where: {
          auth_id: item.authorId,
        },
        include: {
          user: true,
        },
      })
      delete user.password
      delete user.user.authId
      return {
        ...item,
        ...user,
      }
    })
    return data
  }
}
