import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { User } from '../user/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkDTO, EditBookmarkDTO } from './dto/bookmark.dto';
import { BookmarkService } from './bookmark.service';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private readonly bookmark: BookmarkService) {

    }

    @Get()
    getAll(@User() user: PrismaUser) {
        return this.bookmark.getAll(user);
    }

    @Get(':id')
    getById(@Param('id') id: string, @User() user: PrismaUser) {
        return this.bookmark.getById(id, user.id);
    }

    @Patch(':id')
    editById(@Param('id') id: string, @User() user: PrismaUser, @Body() bm: EditBookmarkDTO) {
        return this.bookmark.editById(id, user.id, bm);
    }


    @Delete(':id')
    deleteById(@Param('id') id: string, @User() user: PrismaUser) {
        return this.bookmark.deleteById(id, user.id);
    }

    @Post('create')
    create(@User() user: PrismaUser, @Body() bm: BookmarkDTO) {
        return this.bookmark.create(user, bm);
    }
}
