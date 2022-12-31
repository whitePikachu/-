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
    if (((await this.getpost(postid)) as any).cod !== 400) {
      return await this.prisma.post.update({
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
    return { cod: 400, message: '帖子不存在' }
  }

  async delete(postid: number) {
    if (((await this.getpost(postid)) as any).cod !== 400) {
      return await this.prisma.post.delete({
        where: {
          id: postid,
        },
      })
    }
    return { cod: 400, message: '帖子不存在' }
  }

  async getpost(postid: number) {
    const data = await this.prisma.post.findUnique({
      where: {
        id: postid,
      },
      include: {
        author: true,
        plate: true,
        comment: true,
      },
    })
    if (!data) {
      return { cod: 400, message: '帖子不存在' }
    }
    delete data.author.password
    delete data.author.username
    delete data.author.email
    delete data.plate.id
    delete data.id
    delete data.authorId
    delete data.plateId

    return data
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
