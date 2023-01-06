import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator'

export default class userInfoDto {
  @IsNotEmpty({ message: 'QQ不能为空' })
  // @IsNumber({ allowNaN: false }, { message: 'QQ必须为数字' })
  @MaxLength(11, { message: 'QQ长度不能超过11' })
  QQ: string
  @IsNotEmpty({ message: '昵称不能为空' })
  @MaxLength(10, { message: 'github长度不能超过10' })
  nickname: string
  @IsNotEmpty({ message: 'github不能为空' })
  @MaxLength(30, { message: 'github长度不能超过30' })
  github: string
  @IsNotEmpty({ message: '个性签名不能为空' })
  @MaxLength(30, { message: '个性签名长度不能超过30' })
  signature: string
}
