import { AuthService } from '@/auth/auth.service'
import { PrismaService } from '@/prisma/prisma.service'
import { RedisService } from '@/redis/redis.service'
import { UserinfoService } from '@/userinfo/userinfo.service'
import { BadGatewayException, BadRequestException, HttpException, Injectable } from '@nestjs/common'

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly auth: AuthService,
    private readonly userinfo: UserinfoService,
  ) {}
  async post(authId: number, plateid: number = 0, { title, content }) {
    const res = await this.prisma.post.create({
      data: {
        title,
        content,
        authorId: authId,
        plateId: plateid,
      },
      select: { id: true },
    })
    this.userinfo.updateinfo(authId, {
      exp: 1,
      mapleCoin: 1,
      level: 0,
    })
    return { code: 200, message: '发帖成功', data: res }
  }
  async updated(userId: number, postid: number, { title, content, plateId }) {
    const post = (await this.getpost(postid)) as any
    if (post.cod !== 400) {
      console.log(userId)
      const Permissions = (await this.auth.checkPermissions(userId)) as any
      if (userId === post.author.auth_id || Permissions.msg === '管理员' || Permissions.msg === '超级管理员') {
        const res = await this.prisma.post.update({
          where: {
            id: postid,
          },
          data: {
            title,
            content,
            plateId,
          },
          select: { id: true },
        })
        return { code: 200, message: '修改成功', data: res }
      } else {
        return { code: 400, message: '没有权限' }
      }
    }
    return { cod: 400, message: '帖子不存在' }
  }

  async delete(userId: number, postid: number) {
    const post = (await this.getpost(postid)) as any
    const Permissions = (await this.auth.checkPermissions(userId)) as any
    if (userId === post.author.auth_id || Permissions.msg === '管理员' || Permissions.msg === '超级管理员') {
      if (post.cod !== 400) {
        return await this.prisma.post.delete({
          where: {
            id: postid,
          },
        })
      }
      return { cod: 400, message: '帖子不存在' }
    } else {
      return { code: 400, message: '没有权限' }
    }
  }

  async getpost(postid: number) {
    const data = await this.prisma.post.findUnique({
      where: {
        id: postid,
      },
      include: {
        author: true,
      },
    })
    if (!data) {
      return { cod: 400, message: '帖子不存在' }
    }
    const comment = await this.prisma.comment.count({
      where: {
        postId: postid,
      },
    })
    delete data.author.password
    delete data.author.username
    delete data.author.email
    delete data.authorId
    return { comment, ...data }
  }

  async getpostlist(plateid: number, page: number = 1, limit: number = 10, isTop = false) {
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
          isTop: true,
          views: true,
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
          isTop: Number(isTop),
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
      item.content = item.content.slice(0, 40).concat('...')
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
        views: true,
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
        views: true,
      },
    })
    const total = await this.prisma.post.count({
      where: {
        authorId: userId,
      },
    })
    return await this.res(total, data, limit)
  }
  //增加浏览量
  async addView(ip: string, postid: number) {
    const data = await this.prisma.post.findUnique({
      where: {
        id: postid,
      },
      select: {
        views: true,
      },
    })
    if ((await this.redis.exists(`${ip}:views:${postid}`)) === 1 || (await this.redis.ttl(`ip:${postid}:views`)) > 0) {
      return { cod: 200, data: data.views }
    } else {
      await this.redis.set(`${ip}:views:${postid}`, '', 'EX', 60 * 60 * 24)
    }
    await this.prisma.post.update({
      where: {
        id: postid,
      },
      data: {
        views: data.views + 1,
      },
    })
    return { cod: 200, message: '增加浏览量成功', data: data.views + 1 }
  }
  // 置顶帖子
  async setTop(postid: number, userid: number) {
    const data = await this.prisma.post.findUnique({
      where: {
        id: postid,
      },
      select: {
        isTop: true,
      },
    })
    if (!data) {
      throw new HttpException('帖子不存在', 404)
    }

    const admin = await this.auth.checkPermissions(userid)
    if (admin.msg === '管理员' || '超级管理员') {
      if (data.isTop) {
        const res = await this.prisma.post.update({
          where: {
            id: postid,
          },
          data: {
            isTop: 0,
          },
          select: {
            isTop: true,
          },
        })

        return { cod: 200, message: '取消置顶成功', data: Boolean(res.isTop) }
      } else {
        const res = await this.prisma.post.update({
          where: {
            id: postid,
          },
          data: {
            isTop: 1,
          },
          select: {
            isTop: true,
          },
        })

        return { cod: 200, message: '置顶成功', data: Boolean(res.isTop) }
      }
    } else {
      throw new HttpException('权限不足', 403)
    }
  }
}
