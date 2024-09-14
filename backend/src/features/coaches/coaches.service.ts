import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { PatchCoachDTO, PostCoachDTO } from './coaches.dto';
import { hash } from 'argon2';

@Injectable()
export class CoachesService {
  constructor(private readonly prisma: PrismaService) {}

  public async getCoaches() {
    return this.prisma.employee
      .findMany({
        where: {
          role: 'Coach',
          disabled: false,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          birthDate: true,
          gender: true,
          _count: {
            select: {
              customers: true,
            },
          },
        },
      })
      .then((coaches) =>
        coaches.map((coach) => ({
          ...coach,
          _count: undefined,
          customers: coach._count.customers,
          image: `static/employees/${coach.id}.png`,
        }))
      );
  }

  public async getCoach(id: number) {
    const coach = await this.prisma.employee.findUnique({
      where: {
        id,
        role: 'Coach',
        disabled: false,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        phoneNumber: true,
        gender: true,
      },
    });

    if (!coach) {
      throw new NotFoundException('Coach not found');
    }

    return {
      ...coach,
      image: `static/employees/${coach.id}.png`,
    };
  }

  public async patchCoach(id: number, coach: PatchCoachDTO) {
    try {
      return await this.prisma.employee.update({
        where: { id, role: 'Coach', disabled: false },
        data: coach,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          birthDate: true,
          phoneNumber: true,
          gender: true,
        },
      });
    } catch (e) {
      throw new NotFoundException('Coach not found');
    }
  }

  public async deleteCoach(id: number) {
    try {
      return await this.prisma.employee.update({
        where: { id, role: 'Coach', disabled: false },
        data: { disabled: true },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          birthDate: true,
          phoneNumber: true,
          gender: true,
        },
      });
    } catch (e) {
      throw new NotFoundException('Coach not found');
    }
  }

  public async createCoach(coach: PostCoachDTO) {
    try {
      return await this.prisma.employee.create({
        data: {
          firstName: coach.firstName,
          lastName: coach.lastName,
          email: coach.email,
          password: await hash(coach.password),
          birthDate: new Date(coach.birthDate),
          gender: coach.gender,
          role: 'Coach',
          phoneNumber: coach.phoneNumber,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          birthDate: true,
          phoneNumber: true,
          gender: true,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  public async createAdmin(email: string, password: string) {
    try {
      return await this.prisma.employee.create({
        data: {
          firstName: 'Admin',
          lastName: '',
          email: email,
          password: await hash(password),
          birthDate: new Date(),
          gender: 'Male',
          role: 'CEO',
          phoneNumber: '',
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          birthDate: true,
          phoneNumber: true,
          gender: true,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
