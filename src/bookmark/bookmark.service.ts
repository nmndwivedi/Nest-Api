import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDTO, EditBookmarkDTO } from './dto/bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  getAll(user: User) {
    return this.prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async getById(id: string, userId: string) {
    let bm;
    try {
      bm = await this.prisma.bookmark.findFirst({
        where: {
          id: id,
          userId: userId,
        },
      });
    } catch (e) {
      throw new ForbiddenException(
        'You are not allowed to access this bookmark',
      );
    }

    return bm;
  }

  async editById(id: string, userId: string, bookmarkData: EditBookmarkDTO) {
    let bm;
    try {
      bm = this.prisma.bookmark.updateMany({
        where: {
          id: id,
          userId: userId,
        },
        data: bookmarkData,
      });
    } catch (e) {
      throw new ForbiddenException(
        'You are not allowed to access this bookmark',
      );
    }

    return bm;
  }

  async deleteById(id: string, userId: string) {
    let bm;
    try {
      bm = this.prisma.bookmark.deleteMany({
        where: {
          id: id,
          userId: userId,
        },
      });
    } catch (e) {
      throw new ForbiddenException(
        'You are not allowed to access this bookmark',
      );
    }

    return bm;
  }

  create(user: User, bm: BookmarkDTO) {
    return this.prisma.bookmark.create({
      data: {
        title: bm.title,
        url: bm.url,
        description: bm.description || '',
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
}
