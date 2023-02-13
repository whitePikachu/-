import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { AuthGuard } from '@nestjs/passport'
import UserInfoDto from './dto/userinfo.dto'

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('getuserlist')
  async getuserlist(@Query('') Query, @Req() req) {
    const { page = 1, limit = 10 } = Query
    const isSuper = await this.adminService.verifyPermissions(req.user)
    if (isSuper) {
      return await this.adminService.getuserlist(+page, +limit)
    } else {
      throw new BadRequestException('权限不足')
    }
  }
  @Patch('updateUserInfo')
  async updateUserInfo(@Body() dto: UserInfoDto, @Req() req) {
    const isSuper = await this.adminService.verifyPermissions(req.user)
    if (isSuper) {
      return await this.adminService.updateUserInfo(dto)
    } else {
      throw new BadRequestException('权限不足')
    }
  }
  @Post('addUser')
  async addUser(@Body() dto: UserInfoDto, @Req() req) {
    const isSuper = await this.adminService.verifyPermissions(req.user)
    if (isSuper) {
      return await this.adminService.addUser(dto)
    } else {
      throw new BadRequestException('权限不足')
    }
  }
  @Delete('deleteUser')
  async deleteUser(@Query('') Query, @Req() req) {
    const { authId } = Query
    const isSuper = await this.adminService.verifyPermissions(req.user)
    if (isSuper) {
      return await this.adminService.deleteUser(authId)
    } else {
      throw new BadRequestException('权限不足')
    }
  }
  //searchUser
  @Get('searchUser')
  async searchUser(@Query('') Query, @Req() req) {
    const { page = 1, limit = 10, username } = Query
    const isSuper = await this.adminService.verifyPermissions(req.user)
    if (isSuper) {
      return await this.adminService.searchUser(username, +page, +limit)
    } else {
      throw new BadRequestException('权限不足')
    }
  }
  //getPostList
  @Get('getPostList')
  async getPostList(@Query('') Query, @Req() req) {
    const { page = 1, limit = 10 } = Query
    const isSuper = await this.adminService.verifyPermissions(req.user)
    if (isSuper) {
      return await this.adminService.getPostList(+page, +limit)
    } else {
      throw new BadRequestException('权限不足')
    }
  }
  //searchPost
  @Get('searchPost')
  async searchPost(@Query('') Query, @Req() req) {
    const { page = 1, limit = 10, search } = Query
    const isSuper = await this.adminService.verifyPermissions(req.user)
    if (isSuper) {
      return await this.adminService.searchPost(search, +page, +limit)
    } else {
      throw new BadRequestException('权限不足')
    }
  }
  //getCommentList
  @Get('getCommentList')
  async getCommentList(@Query('') Query, @Req() req) {
    const { page = 1, limit = 10 } = Query
    const isSuper = await this.adminService.verifyPermissions(req.user)
    if (isSuper) {
      return await this.adminService.getCommentList(+page, +limit)
    } else {
      throw new BadRequestException('权限不足')
    }
  }
  //searchComment
  @Get('searchComment')
  async searchComment(@Query('') Query, @Req() req) {
    const { page = 1, limit = 10, search } = Query
    const isSuper = await this.adminService.verifyPermissions(req.user)
    if (isSuper) {
      return await this.adminService.searchComment(search, +page, +limit)
    } else {
      throw new BadRequestException('权限不足')
    }
  }
}
