import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Employee } from '@prisma/client';

type JWTPayload = {
  id: number;
};

export type AuthenticatedRequest = Request & { user: Employee; role: 'admin' | 'coach' | 'finance' };

function extractJWTFromRequest(request: Request) {
  const [type, token] = (request.headers['authorization']?.split(' ') ?? []) as string[];
  return type === 'Bearer' ? token : undefined;
}

export function getRoleOfUser(user: Employee): 'admin' | 'coach' | 'finance' {
  if (['CEO', 'CTO', 'COO'].includes(user.role)) return 'admin';
  if (['Coach'].includes(user.role)) return 'coach';
  return 'finance';
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractJWTFromRequest(request);

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: JWTPayload = await this.jwtService.verifyAsync(token);
      const user = await this.getUserContext(payload.id);

      if (user.disabled) {
        throw new UnauthorizedException('User is disabled');
      }

      request.user = user;
      request.role = getRoleOfUser(user);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private async getUserContext(id: number) {
    const user = await this.prismaService.employee.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User doesn't exist but JWT was valid");
    }

    return user;
  }
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
