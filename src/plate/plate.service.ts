import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PlateService {
  constructor(private readonly prisma: PrismaService) {}
  addplate(plate: string) {
    return this.prisma.plate.create({
      data: {
        name: plate,
      },
    })
  }
  async getplate() {
    return await this.prisma.plate.findMany({
      select: {
        id: true,
        name: true,
      },
    })
  }
  async deleteplate(id: number) {
    return await this.prisma.plate.delete({
      where: {
        id,
      },
    })
  }

  async updateplate(plateid: number, name: string) {
    return await this.prisma.plate.update({
      where: {
        id: plateid,
      },
      data: {
        name,
      },
    })
  }
  //根据发帖数量统计板块
  async getplatebycount() {
    const postdata = await this.prisma.post.findMany({
      include: {
        plate: true,
      },
    })
    const plate = await this.getplate()
    let res = plate.map((item) => {
      let count = 0
      postdata.forEach((post) => {
        if (post.plateId === item.id) {
          count++
        }
      })
      return {
        ...item,
        count: count,
      }
    })
    //排序
    res = res.sort((a, b) => {
      return b.count - a.count
    })
    return res
  }
}
