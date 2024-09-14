import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StaticModule } from './static/static.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, StaticModule],
})
export class CoreModule {}
