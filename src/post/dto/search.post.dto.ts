import { IsNotEmpty } from 'class-validator'
export default class searchPostDto {
  @IsNotEmpty({ message: '搜索内容不能为空' })
  title: string
  @IsNotEmpty({ message: '请选择页数' })
  page: number = 1
}
