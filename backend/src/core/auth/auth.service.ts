import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { hash, verify } from 'argon2';
import { z } from 'zod';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { Employee } from '@prisma/client';
import { getRoleOfUser } from './auth.guard';

const OldAPI200 = z.object({
  access_token: z.string(),
});

const OldAPI401 = z.object({
  detail: z.string(),
});

const OldAPI422 = z.object({
  detail: z.string(),
});

const OldApiEmployeePayload = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  surname: z.string(),
  birth_date: z.string().transform((value) => new Date(value)),
  gender: z.string(),
  work: z.string(),
});

const OldApiJWTPayload = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  surname: z.string(),
});

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  public async login(email: string, password: string) {
    let user = await this.prisma.employee.findUnique({ where: { email } });

    if (user == null || user.password == null) {
      user = await this.loginWithOldAPI(email, password);
    }

    if (user.disabled) {
      throw new UnauthorizedException('User is disabled');
    }

    if (!(await verify(user.password, password))) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      access_token: this.jwtService.sign({ id: user.id }),
      user: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        id: user.id,
        image: `/static/employees/${user.id}.png`,
        role: getRoleOfUser(user),
      },
    };
  }

  private async loginWithOldAPI(email: string, password: string): Promise<Employee> {
    let code: number;
    let data: unknown;

    try {
      const response = await fetch(`${this.configService.get('API_OLD_URL')}/employees/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Group-Authorization': this.configService.get('API_GROUP_AUTHORIZATION'),
        },
        body: JSON.stringify({ email, password }),
      });

      code = response.status;
      data = await response.json();
    } catch (error) {
      throw new InternalServerErrorException('Failed to authenticate with old API');
    }

    // Check 200 response
    if (code === 200) {
      const result = OldAPI200.safeParse(data);

      if (!result.success) {
        throw new InternalServerErrorException('Failed to authenticate with old API');
      }

      const oldApiAccessToken = result.data.access_token;
      const decoded = OldApiJWTPayload.safeParse(this.jwtService.decode(oldApiAccessToken));

      if (!decoded.success) {
        throw new InternalServerErrorException('Failed to authenticate with old API');
      }

      return await this.migrateEmployee(oldApiAccessToken, password);
    }

    // Check 401 response
    if (code === 401) {
      const result = OldAPI401.safeParse(data);

      if (!result.success) {
        throw new InternalServerErrorException('Failed to authenticate with old API');
      }
      throw new UnauthorizedException(result.data.detail);
    }

    // Check 422 response
    if (code === 422) {
      const result = OldAPI422.safeParse(data);

      if (!result.success) {
        throw new InternalServerErrorException('Failed to authenticate with old API');
      }
      throw new UnprocessableEntityException(result.data.detail);
    }

    // Any other response
    throw new InternalServerErrorException('Failed to authenticate with old API');
  }

  private async migrateEmployee(accessToken: string, password: string): Promise<Employee> {
    const employee = OldApiEmployeePayload.safeParse(
      await fetch(`${this.configService.get('API_OLD_URL')}/employees/me`, {
        headers: {
          Accept: 'application/json',
          'X-Group-Authorization': this.configService.get('API_GROUP_AUTHORIZATION'),
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((response) => response.json() as unknown)
    );

    if (!employee.success) {
      throw new InternalServerErrorException('Failed to fetch employee data from old API');
    }

    try {
      return this.prisma.employee.upsert({
        where: {
          externalId: employee.data.id,
        },
        update: {
          email: employee.data.email,
          firstName: employee.data.name,
          lastName: employee.data.surname,
          password: await hash(password),
          birthDate: employee.data.birth_date,
          gender: employee.data.gender,
          role: employee.data.work,
        },
        create: {
          externalId: employee.data.id,
          email: employee.data.email,
          firstName: employee.data.name,
          lastName: employee.data.surname,
          password: await hash(password),
          birthDate: employee.data.birth_date,
          gender: employee.data.gender,
          phoneNumber: faker.phone.number({ style: 'international' }),
          role: employee.data.work,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create employee');
    }
  }
}
