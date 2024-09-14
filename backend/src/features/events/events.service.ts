import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  public async getEvents() {
    return this.prisma.event.findMany({
      select: {
        id: true,
        // employee: {
        //   select: {
        //     id: true,
        //     firstName: true,
        //     lastName: true,
        //   },
        // },
        name: true,
        type: true,
        maxParticipants: true,
        date: true,
        duration: true,
        location: true,
        locationX: true,
        locationY: true,
      },
    });
  }
}
