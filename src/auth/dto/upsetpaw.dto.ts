import { IsNotEmpty } from 'class-validator'

export default class UpsetpawDto {
  @IsNotEmpty({ message: '密码不能为空' })
  paw: string
  @IsNotEmpty({ message: '新密码不能为空' })
  newpaw: string
}
