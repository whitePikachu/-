import { IsNotEmpty, IsString } from 'class-validator'

export default class UserInfoDto {
  authId: number
  paw: string
  username: string
  email: string
  jurisdiction: string
  avatar: string
  nickname: string
  github: string
  QQ: string
  signature: string
  exp: number
  mapleCoin: number
}
