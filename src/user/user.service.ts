import { Injectable, HttpException, ForbiddenException } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { EditUserDTO } from 'src/auth/dto/editUser.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  editUser(newUser: EditUserDTO, user: PrismaUser) {
    // if(newUser.email!==user.email) throw new ForbiddenException('Email cannot be changed');

    return this.prisma.user.update({
      where: { id: user.id },
      data: newUser,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      }
  });
}
}
