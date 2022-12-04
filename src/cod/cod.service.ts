import { RedisService } from '@/redis/redis.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createCipheriv, createDecipheriv } from 'crypto'
@Injectable()
export class CodService {
  constructor(private readonly redisservice: RedisService, private configservice: ConfigService) {}
  async getCod(ip: string) {
    const cod = this.randomString(6)
    await this.redisservice.set(`cod:${ip}`, this.encrypt(cod), 'EX', 60)
    return { status: true, msg: '验证码已发送', cod }
  }
  async verifyCod(ip: string, cod: string) {
    const Rcod = await this.redisservice.get(`cod:${ip}`)
    if (!Rcod) {
      return { status: false, msg: '验证码不存在' }
    }
    if (Rcod === this.decrypt(cod)) {
      await this.redisservice.del(`cod:${ip}`)
      return { status: false, msg: '验证码错误' }
    }
    if ((await this.redisservice.ttl(`cod:${ip}`)) < 0) {
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
  private encrypt(
    data: string,
    key: string = this.configservice.get('CODE_KEY'),
    iv: string = this.configservice.get('CODE_IV'),
  ) {
    const cipher = createCipheriv('aes192', Buffer.from(key, 'utf-8'), iv)
    cipher.update(data, 'utf-8', 'hex')
    return cipher.final('hex')
  }
  private decrypt(
    encrypted: string,
    key: string = this.configservice.get('CODE_KEY'),
    iv: string = this.configservice.get('CODE_IV'),
  ) {
    const decipher = createDecipheriv('aes192', Buffer.from(key, 'utf-8'), iv)
    decipher.update(encrypted, 'hex', 'utf8')
    return decipher.final('utf8')
  }
}
