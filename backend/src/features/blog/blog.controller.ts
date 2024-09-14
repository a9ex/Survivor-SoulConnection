import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogDto } from './blog.dto';
import { AuthenticatedRequest } from 'src/core/auth/auth.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('posts')
  public async posts() {
    return this.blogService.posts();
  }

  @Get('post/:id')
  public async post(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.post(id);
  }

  @Post('create')
  public async createPost(@Body() data: BlogDto, @Req() req: AuthenticatedRequest) {
    return this.blogService.createPost(data, req.user.id);
  }

  @Put('edit/:id')
  public async updatePost(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: BlogDto
  ) {
    return this.blogService.updatePost(req.user.id, id, data);
  }

  @Delete('post/:id')
  public async deletePost(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.blogService.deletePost(req.user.id, id);
  }
}
