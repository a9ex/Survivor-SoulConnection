import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { UpdateProfileDTO } from 'src/core/auth/auth.dto';
import { AuthenticatedRequest } from 'src/core/auth/auth.guard';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  public profile(user: AuthenticatedRequest['user']): Omit<AuthenticatedRequest['user'], 'password' | 'disabled'> {
    delete user.password;
    delete user.disabled;
    return user;
  }

  public async updateProfile(user: AuthenticatedRequest['user'], body: UpdateProfileDTO) {
    try {
      await this.prisma.employee.update({
        where: {
          id: user.id,
        },
        data: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          birthDate: body.birthDate,
          gender: body.gender,
          role: body.role,
          password: body.password ? await hash(body.password) : undefined,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  public async deleteProfile(user: AuthenticatedRequest['user']) {
    try {
      await this.prisma.employee.update({
        where: {
          id: user.id,
        },
        data: {
          disabled: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to disable profile');
    }
  }

  public async profileById(user: AuthenticatedRequest['user'], id: number) {
    // TODO: Check user role - GDPR compliance
    const profile = await this.prisma.employee.findUnique({
      where: {
        id,
      },
    });

    if (profile == null) {
      throw new NotFoundException('Profile not found');
    }

    delete profile.password;
    delete profile.disabled;

    return profile;
  }

  public async updateProfileById(user: AuthenticatedRequest['user'], id: number, body: UpdateProfileDTO) {
    // TODO: Check user role - GDPR compliance
    const profile = await this.prisma.employee.findUnique({
      where: {
        id,
      },
    });

    if (profile == null) {
      throw new NotFoundException('Profile not found');
    }

    try {
      await this.prisma.employee.update({
        where: {
          id,
        },
        data: {
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          birthDate: body.birthDate,
          gender: body.gender,
          role: body.role,
          password: body.password ? await hash(body.password) : undefined,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update profile');
    }
  }

  public async deleteProfileById(user: AuthenticatedRequest['user'], id: number) {
    const profile = await this.prisma.employee.findUnique({
      where: {
        id,
      },
    });

    if (profile == null) {
      throw new NotFoundException('Profile not found');
    }

    try {
      await this.prisma.employee.update({
        where: {
          id,
        },
        data: {
          disabled: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to disable profile');
    }
  }
}
