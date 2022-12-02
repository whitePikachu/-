import { IsEmail, IsNotEmpty } from 'class-validator'
export default class {
  @IsNotEmpty({ message: '用户名不能为空' })
  name: string
  @IsNotEmpty({ message: '密码不能为空' })
  paw: string
  @IsEmail({ message: '请填写正确邮箱' })
  emali: string
}
