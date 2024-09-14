import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { BlogDto } from './blog.dto';

@Injectable()
export class BlogService {
  constructor(private readonly prismaService: PrismaService) {}

  public async posts() {
    return this.prismaService.blog.findMany({
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  public async post(id: number) {
    const post = await this.prismaService.blog.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  public async createPost(data: BlogDto, userId: number) {
    return this.prismaService.blog.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: userId,
      },
    });
  }

  public async updatePost(userId: number, id: number, data: BlogDto) {
    const post = await this.prismaService.blog.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }

    return this.prismaService.blog.update({
      where: {
        id: id,
      },
      data: {
        title: data.title,
        content: data.content,
      },
    });
  }

  public async deletePost(userId: number, id: number) {
    const post = await this.prismaService.blog.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }

    return this.prismaService.blog.delete({
      where: {
        id: id,
      },
    });
  }
}
