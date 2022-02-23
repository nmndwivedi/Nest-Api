import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO, SignupDTO } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(credentials: LoginDTO) {
    let user = await this.prisma.user.findFirst({where: {email: credentials.email}});
    console.log(user);
    return { credentials };
  }

  async signup(d: SignupDTO) {
    let pHash = await argon.hash(d.password);
    let user = await this.prisma.user.create({
      data: {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        passwordHash: pHash
      }
    });

    return user;
  }
}
