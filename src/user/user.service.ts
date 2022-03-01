import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getUser() {
    
    return {
      name: 'Naman',
      age: 23,
    };
  }
}
