import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('API_DATABASE_URL'),
        },
      },
    });
  }

  cleanAll() {
    return this.$transaction([
      this.customer.deleteMany(),
      this.employee.deleteMany(),
      this.encounter.deleteMany(),
      this.event.deleteMany(),
      this.paymentRecord.deleteMany(),
      this.tip.deleteMany(),
    ]);
  }
}
