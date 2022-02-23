import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO, SignupDTO } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(credentials: LoginDTO) {
    let user = await this.prisma.user.findUnique({
      where: { email: credentials.email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        passwordHash: true
      }
    });

    if (!user) throw new ForbiddenException('Invalid credentials');

    let valid = await argon.verify(user.passwordHash, credentials.password);

    if (!valid) throw new ForbiddenException('Invalid credentials');

    delete user.passwordHash;

    return user;
  }

  async signup(d: SignupDTO) {
    let pHash = await argon.hash(d.password);

    try {
      let user = await this.prisma.user.create({
        data: {
          firstName: d.firstName,
          lastName: d.lastName,
          email: d.email,
          passwordHash: pHash,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true
        }
      });
      
      return user;
    } catch (e) {
      if (!(e instanceof PrismaClientKnownRequestError) || e.code !== 'P2002') throw e;
      
      throw new ForbiddenException ('Email already in use');
    }
  }
}
