import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
export default class {
  @MinLength(6, { message: '用户名不能少于6位' })
  @MaxLength(12, { message: '用户名不能多于12位' })
  @IsNotEmpty({ message: '用户名不能为空' })
  name: string
  @MinLength(6, { message: '密码不能少于6位' })
  @MaxLength(20, { message: '密码不能多于20位' })
  @IsNotEmpty({ message: '密码不能为空' })
  paw: string
  @IsEmail({ message: '请填写正确邮箱' })
  emali: string
}
