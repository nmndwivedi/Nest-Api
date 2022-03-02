import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { User } from './decorator';
import { User as PrismaUser } from '@prisma/client';
import { EditUserDTO } from '../auth/dto/editUser.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  getUser(@User() user: PrismaUser) {
    return user;
  }

  @Patch('me')
  editUser(@Body() newUser: EditUserDTO, @User() user: PrismaUser) {
    return this.userService.editUser(newUser, user);
  }
}
