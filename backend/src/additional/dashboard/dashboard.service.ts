import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  public async eventsByMonth() {
    const events = await this.prisma.event.findMany({
      select: {
        id: true,
        date: true,
      },
    });

    const byMonth = events.reduce((acc, event) => {
      const date = new Date(event.date);
      const ymdate = date.getFullYear() * 12 + date.getMonth();
      acc[ymdate] = (acc[ymdate] ?? 0) + 1;
      return acc;
    }, new Map<number, number>());

    return byMonth;
  }

  public async meetingsTopSource() {
    const meetings = await this.prisma.encounter.findMany({
      select: {
        id: true,
        source: true,
      },
    });

    const bySource = meetings.reduce((acc, meeting) => {
      acc[meeting.source] = (acc[meeting.source] ?? 0) + 1;
      return acc;
    }, {});

    return bySource;
  }

  public async ratings() {
    const ratings = await this.prisma.encounter.findMany({
      select: {
        id: true,
        rating: true,
      },
    });

    const byRating = ratings.reduce((acc, rating) => {
      acc[rating.rating] = (acc[rating.rating] ?? 0) + 1;
      return acc;
    }, {});

    return byRating;
  }

  public async astrologicalSigns() {
    const encounters = await this.prisma.customer.findMany({
      select: {
        id: true,
        astrologicalSign: true,
      },
    });

    const bySign = encounters.reduce((acc, encounter) => {
      acc[encounter.astrologicalSign] = (acc[encounter.astrologicalSign] ?? 0) + 1;
      return acc;
    }, {});

    return bySign;
  }

  public async genderRepartition() {
    const customers = await this.prisma.customer.findMany({
      select: {
        id: true,
        gender: true,
      },
    });

    const byGender = customers.reduce((acc, customer) => {
      acc[customer.gender] = (acc[customer.gender] ?? 0) + 1;
      return acc;
    }, {});

    return byGender;
  }
}
