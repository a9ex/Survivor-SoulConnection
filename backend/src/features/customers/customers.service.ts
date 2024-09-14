import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PatchCustomerDTO, PostCustomerDTO } from './customers.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  public async getCustomers() {
    return this.prisma.customer
      .findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          birthDate: true,
          gender: true,
          description: true,
          phoneNumber: true,
          address: true,
          astrologicalSign: true,
          coachId: true,
        },
      })
      .then((customers) =>
        customers.map((customer) => ({
          ...customer,
          image: `static/customers/${customer.id}.png`,
        }))
      );
  }

  public async getCoachCustomers(coachId: number) {
    return this.prisma.customer
      .findMany({
        where: { coachId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          birthDate: true,
          gender: true,
          description: true,
          phoneNumber: true,
          address: true,
          astrologicalSign: true,
          coachId: true,
        },
      })
      .then((customers) =>
        customers.map((customer) => ({
          ...customer,
          image: `static/customers/${customer.id}.png`,
        }))
      );
  }

  public async getCustomerById(id: number) {
    try {
      return this.prisma.customer
        .findUnique({
          where: { id },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            birthDate: true,
            gender: true,
            description: true,
            phoneNumber: true,
            address: true,
            astrologicalSign: true,
            coachId: true,
            encounters: {
              select: {
                date: true,
                rating: true,
                comment: true,
                source: true,
              },
            },
            payments: {
              select: {
                date: true,
                paymentMethod: true,
                amount: true,
                comment: true,
              },
            },
          },
        })
        .then((customer) => ({
          ...customer,
          image: `static/customers/${customer.id}.png`,
        }));
    } catch (e) {
      throw new NotFoundException('Customer not found');
    }
  }

  public async getCoachCustomerById(coachId: number, id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { coachId, id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        gender: true,
        description: true,
        phoneNumber: true,
        address: true,
        astrologicalSign: true,
        coachId: true,
        encounters: {
          select: {
            date: true,
            rating: true,
            comment: true,
            source: true,
          },
        },
        payments: {
          select: {
            date: true,
            paymentMethod: true,
            amount: true,
            comment: true,
          },
        },
      },
    });

    if (!customer) throw new NotFoundException('Customer not found');

    return {
      ...customer,
      image: `static/customers/${customer.id}.png`,
    };
  }

  public async patchCustomer(id: number, data: PatchCustomerDTO) {
    try {
      return this.prisma.customer
        .update({
          where: { id },
          data,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            birthDate: true,
            gender: true,
            description: true,
            phoneNumber: true,
            address: true,
            astrologicalSign: true,
            coachId: true,
          },
        })
        .then((customer) => ({
          ...customer,
          image: `static/customers/${customer.id}.png`,
        }));
    } catch (e) {
      throw new NotFoundException('Customer not found');
    }
  }

  public async patchCoachCustomer(coachId: number, id: number, data: PatchCustomerDTO) {
    try {
      return this.prisma.customer
        .update({
          where: { coachId, id },
          data,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            birthDate: true,
            gender: true,
            description: true,
            phoneNumber: true,
            address: true,
            astrologicalSign: true,
            coachId: true,
          },
        })
        .then((customer) => ({
          ...customer,
          image: `static/customers/${customer.id}.png`,
        }));
    } catch (e) {
      throw new NotFoundException('Customer not found');
    }
  }

  public async deleteCustomer(id: number, coachId?: number) {
    try {
      return this.prisma.customer.delete({
        where: { id, coachId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          birthDate: true,
          gender: true,
          description: true,
          phoneNumber: true,
          address: true,
          astrologicalSign: true,
          coachId: true,
        },
      });
    } catch (e) {
      throw new NotFoundException('Customer not found');
    }
  }

  public async createCustomer(data: PostCustomerDTO, coachId?: number) {
    try {
      return this.prisma.customer.create({
        data: {
          ...data,
          coachId,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          birthDate: true,
          gender: true,
          description: true,
          phoneNumber: true,
          address: true,
          astrologicalSign: true,
          coachId: true,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException('Failed to create customer');
    }
  }
}
