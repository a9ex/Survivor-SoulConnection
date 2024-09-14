import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { join } from 'path';
import { Request, Response } from 'express';
import { Public } from 'src/core/auth/auth.guard';

@Controller('static')
export class StaticController {
  @Public()
  @Get(':resource(*)')
  async getStaticResource(@Param('resource') resource: string, @Res() response: Response) {
    return response.sendFile(join(__dirname, '../../../..', 'public', resource));
  }
}
