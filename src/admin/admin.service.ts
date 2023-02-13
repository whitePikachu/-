import { AuthService } from '@/auth/auth.service'
import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import UserInfoDto from './dto/userinfo.dto'
import { hash } from 'argon2'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}
  async getuserlist(page: number = 1, limit: number = 10) {
    const data = await this.prisma.userinfo.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
      },
    })
    const total = await this.prisma.userinfo.count()
    const totalPage = Math.ceil(total / limit)
    data.forEach((item) => {
      delete item.user.password
      delete item.user.auth_id
      delete item.id
      delete item.level
    })
    const res = data.map((item) => {
      const { username, email, jurisdiction } = item.user
      delete item.user
      return { username, email, jurisdiction, ...item }
    })
    return { cod: 200, msg: '获取成功', totalPage, data: res }
  }
  //修改用户信息
  async updateUserInfo(dto: UserInfoDto) {
    dto.exp = Number(dto.exp)
    dto.mapleCoin = Number(dto.mapleCoin)
    const { authId, username, email, jurisdiction, paw, ...data } = dto
    await this.prisma.auth.update({
      where: { auth_id: authId },
      data: {
        username: username,
        email: email,
        jurisdiction: this.PermissionsTonumber(jurisdiction),
      },
    })
    await this.prisma.userinfo.update({
      where: { authId },
      data,
    })
    if (paw) {
      await this.prisma.auth.update({
        where: { auth_id: authId },
        data: {
          password: await hash(paw),
        },
      })
    }

    return { cod: 200, msg: '修改成功' }
  }
  //验证权限
  async verifyPermissions(id: number) {
    const { msg } = await this.auth.checkPermissions(id)
    return msg === '超级管理员'
  }
  //权限转换
  private PermissionsTonumber(permissions: string) {
    switch (permissions) {
      case '普通用户':
        return 0
      case '管理员':
        return 1
      case '超级管理员':
        return 2
      case '禁封用户':
        return 3
      default:
        return 0
    }
  }
  //添加用户
  async addUser(dto: UserInfoDto) {
    const { username, email, jurisdiction, paw, authId, ...data } = dto
    if (data.exp) {
      data.exp = Number(data.exp)
    } else {
      data.exp = 0
    }
    if (data.mapleCoin) {
      data.mapleCoin = Number(data.mapleCoin)
    } else {
      data.mapleCoin = 0
    }
    const auth = await this.prisma.auth.create({
      data: {
        username: username,
        email: email,
        jurisdiction: this.PermissionsTonumber(jurisdiction),
        password: await hash(paw),
        user: {
          create: {
            ...data,
            level: 0,
            avatar: '',
          },
        },
      },
    })
    auth.auth_id
    return { cod: 200, msg: '添加成功' }
  }
  //删除用户
  async deleteUser(authId: number) {
    await this.prisma.auth.delete({
      where: { auth_id: +authId },
    })
    return { cod: 200, msg: '删除成功' }
  }
  //搜索用户
  async searchUser(name: string, page: number = 1, limit: number = 10) {
    //根据用户名和昵称搜索
    const data = await this.prisma.userinfo.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        OR: [{ user: { username: { contains: name } } }, { nickname: { contains: name } }],
      },
      include: {
        user: true,
      },
    })
    const total = await this.prisma.userinfo.count()
    const totalPage = Math.ceil(total / limit)
    data.forEach((item) => {
      delete item.user.password
      delete item.user.auth_id
      delete item.id
      delete item.level
    })
    const res = data.map((item) => {
      const { username, email, jurisdiction } = item.user
      delete item.user
      return { username, email, jurisdiction, ...item }
    })
    return { cod: 200, msg: '获取成功', totalPage, data: res }
  }
  //获取帖子列表
  async getPostList(page: number = 1, limit: number = 10) {
    const data = await this.prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: true,
        plate: true,
      },
    })
    const total = await this.prisma.post.count()
    const totalPage = Math.ceil(total / limit)
    const res = data.map((item) => {
      return { ...item, author: item.author.username, plate: item.plate.name }
    })
    return { cod: 200, msg: '获取成功', totalPage, data: res }
  }
  //搜索帖子
  async searchPost(name: string, page: number = 1, limit: number = 10) {
    const data = await this.prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        OR: [{ title: { contains: name } }, { content: { contains: name } }],
      },
      include: {
        author: true,
        plate: true,
      },
    })
    const total = await this.prisma.post.count({
      where: {
        OR: [{ title: { contains: name } }, { content: { contains: name } }],
      },
    })
    const totalPage = Math.ceil(total / limit)
    const res = data.map((item) => {
      return { ...item, author: item.author.username, plate: item.plate.name }
    })
    return { cod: 200, msg: '获取成功', totalPage, data: res }
  }
  //获取评论
  async getCommentList(page: number = 1, limit: number = 10) {
    const data = await this.prisma.comment.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        post: true,
        author: true,
      },
    })
    const total = await this.prisma.comment.count()
    const totalPage = Math.ceil(total / limit)
    const res = data.map((item) => {
      return { id: item.id, comment: item.content, postTitle: item.post.title, username: item.author.username }
    })
    return { cod: 200, msg: '获取成功', totalPage, data: res }
  }
  //搜索评论
  async searchComment(name: string, page: number = 1, limit: number = 10) {
    const data = await this.prisma.comment.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        OR: [
          { post: { title: { contains: name } } },
          { author: { username: { contains: name } }, content: { contains: name } },
        ],
      },
      include: {
        post: true,
        author: true,
      },
    })
    const totalPage = Math.ceil(data.length / limit)
    const res = data.map((item) => {
      return { id: item.id, comment: item.content, postTitle: item.post.title, username: item.author.username }
    })
    return { cod: 200, msg: '获取成功', totalPage, data: res }
  }
}
