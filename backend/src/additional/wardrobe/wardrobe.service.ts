import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class WardrobeService {
  constructor(private readonly prisma: PrismaService) {}

  private static processClothes(type: string, clothes: { id: number; type: string }[]) {
    return clothes
      .filter((clothe) => clothe.type === type)
      .map((clothe) => ({
        id: clothe.id,
        image: `static/clothes/${clothe.id}.png`,
      }));
  }

  public async getCustomers() {
    return this.prisma.customer
      .findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          description: true,
        },
      })
      .then((customers) =>
        customers.map((customer) => ({
          ...customer,
          image: `static/customers/${customer.id}.png`,
        }))
      );
  }

  public async getCustomerClothes(customerId: number) {
    return this.prisma.clothe
      .findMany({
        where: {
          customerId,
        },
        select: {
          id: true,
          type: true,
        },
      })
      .then((clothes) => ({
        hatsAndCaps: WardrobeService.processClothes('hat/cap', clothes),
        tops: WardrobeService.processClothes('top', clothes),
        bottoms: WardrobeService.processClothes('bottom', clothes),
        shoes: WardrobeService.processClothes('shoes', clothes),
      }));
  }
}
