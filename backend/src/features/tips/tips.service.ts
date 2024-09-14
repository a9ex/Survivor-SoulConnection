import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class TipsService {
  constructor(private readonly prisma: PrismaService) {}

  public async getTips() {
    return this.prisma.tip.findMany({
      select: {
        id: true,
        title: true,
        tip: true,
      },
    });
  }
}
