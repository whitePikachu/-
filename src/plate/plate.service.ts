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
}
