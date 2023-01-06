import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async post(authId: number, plateid: number = 0, { title, content }) {
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

  async getpostlist(plateid: number, page: number = 1, limit: number = 10) {
    if (plateid === 0) {
      const data = await this.prisma.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          authorId: true,
          updatedAt: true,
        },
      })
      const total = await this.prisma.post.count()
      return await this.res(total, data, limit)
    } else {
      const data = await this.prisma.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          plateId: plateid,
        },
        select: {
          id: true,
          title: true,
          content: true,
          authorId: true,
          updatedAt: true,
        },
      })
      const total = await this.prisma.post.count({
        where: {
          plateId: plateid,
        },
      })
      return await this.res(total, data, limit)
    }
  }
  private async res(total: number, data: any, limit: number = 10) {
    const totalPage = Math.ceil(total / limit)
    data?.map(async (item) => {
      item.content = item.content.slice(0, 20).concat('...')
      const user = await this.prisma.auth.findUnique({
        where: {
          auth_id: item.authorId,
        },
        include: {
          user: true,
        },
      })
      let comments = await this.prisma.comment.count({
        where: {
          postId: item.id,
        },
      })
      if (comments) {
        comments = 0
      }
      delete user.password
      delete user.user.authId
      return {
        comments,
        ...item,
        ...user,
      }
    })

    return { totalPage, data }
  }

  async getNewPost(num = 5) {
    const data = await this.prisma.post.findMany({
      take: num,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    })
    return data
  }
  // 根据标题模糊搜索帖子
  async searchPost(title: string, page: number = 1, limit: number = 10) {
    const data = await this.prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        title: {
          contains: title,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        updatedAt: true,
      },
    })
    const total = await this.prisma.post.count({
      where: {
        title: {
          contains: title,
        },
      },
    })
    const redt = data?.map((item) => {
      item.title = item.title.replace(title, `<span style="color:red">${title}</span>`)
      return item
    })
    return await this.res(total, redt, limit)
  }
  // 根据用户id获取帖子
  async getPostByUserId(userId: number, page: number = 1, limit: number = 10) {
    const data = await this.prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        authorId: true,
        updatedAt: true,
      },
    })
    const total = await this.prisma.post.count({
      where: {
        authorId: userId,
      },
    })
    return await this.res(total, data, limit)
  }
}
