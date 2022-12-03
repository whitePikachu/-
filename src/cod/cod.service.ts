import { RedisService } from '@/redis/redis.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CodService {
  constructor(private readonly redisservice: RedisService) {}
  async getcod(ip: string) {
    const cod = this.randomString(6)
    await this.redisservice.set(`cod${ip}`, cod, 'EX', 60)
    return { status: true, msg: '验证码已发送', cod }
  }
  async verifycod(ip: string, cod: string) {
    //是否存在
    const cod1 = await this.redisservice.get(`cod${ip}`)
    if (!cod1) {
      return { status: false, msg: '验证码不存在' }
    }
    //是否正确
    if (cod1 !== cod) {
      await this.redisservice.del(`cod${ip}`)
      return { status: false, msg: '验证码错误' }
    }
    //是否过期
    const ttl = await this.redisservice.ttl(`cod${ip}`)
    if (ttl < 0) {
      return { status: false, msg: '验证码已过期' }
    }
    return { status: true, msg: '验证码正确' }
  }
  private randomString(len: number) {
    len = len || 32
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    var maxPos = $chars.length
    var pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }
}
