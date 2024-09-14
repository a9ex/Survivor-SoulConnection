import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CompatibilityService {
  constructor(private readonly prisma: PrismaService) {}

  public async getCustomers() {
    return this.prisma.customer
      .findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          astrologicalSign: true,
        },
      })
      .then((customers) =>
        customers.map((customer) => ({
          ...customer,
          image: `static/customers/${customer.id}.png`,
        }))
      );
  }
}
