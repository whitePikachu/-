import { RedisService } from '@/redis/redis.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AES, enc, mode, pad } from 'crypto-js'
@Injectable()
export class CodService {
  constructor(private readonly redisservice: RedisService, private configservice: ConfigService) {}
  async getCod(ip: string) {
    const cod = this.generatCod()
    await this.redisservice.set(`cod:${ip}`, JSON.stringify(cod), 'EX', 60)
    return { status: true, msg: '验证码已发送', cod: this.encrypt(cod) }
  }
  async verifyCod(ip: string, cod: string) {
    const Rcod = await this.redisservice.get(`cod:${ip}`)
    if (!Rcod) {
      return { status: false, msg: '验证码不存在' }
    }
    if ((await this.redisservice.ttl(`cod:${ip}`)) < 0) {
      return { status: false, msg: '验证码已过期' }
    }
    if (!(await this.verify(Rcod, this.decrypt(cod)))) {
      await this.redisservice.del(`cod:${ip}`)
      return { status: false, msg: '验证码错误' }
    }
    return { status: true, msg: '验证码正确' }
  }
  async verify(cod: string, cod1: string) {
    type cod = {
      world: string
      x: number
      y: number
    }
    const cods: cod[] = JSON.parse(cod)
    type code1 = {
      x: number
      y: number
    }
    const cods1: code1[] = JSON.parse(cod1)
    let success = 0
    console.log(cods, cods1)
    for (let index = 0; index < cods.length; index++) {
      const element = cods[index]
      if (Math.abs(cods1[index]?.x - element.x) < 30 && Math.abs(cods1[index]?.y - element.y) < 30) {
        success++
      }
    }
    console.log(success)

    return success === 4
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
  private generatCod() {
    const s = this.randomString(4)
    let res = []
    //随机数字
    for (let i = 0; i < 4; i++) {
      res.push({
        world: s[i],
        x: Math.floor(Math.random() * 300),
        y: Math.floor(Math.random() * 300),
      })
    }
    return res
  }
  // 加密
  private encrypt(word: string | Object, keyStr: string = this.configservice.get('CODE_KEY')) {
    if (word instanceof Object) {
      word = JSON.stringify(word)
    }
    var key = enc.Utf8.parse(keyStr)
    var encryptedObj = AES.encrypt(enc.Utf8.parse(word as string), key, {
      mode: mode.ECB,
      padding: pad.Pkcs7,
    })
    return encryptedObj.toString()
  }
  // 解密
  private decrypt(word: string, keyStr: string = this.configservice.get('CODE_KEY')) {
    let key = enc.Utf8.parse(keyStr)
    let decrypt = AES.decrypt(word, key, {
      mode: mode.ECB,
      padding: pad.ZeroPadding,
    })
    let decString = enc.Utf8.stringify(decrypt).toString()
    decString = `[${decString.match(/\[(.*?)\]/)?.[1]}]`
    return decString
  }
}
