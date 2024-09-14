import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { FeaturesModule } from './features/features.module';
import { AdditionalModule } from './additional/additional.module';

@Module({
  imports: [CoreModule, FeaturesModule, AdditionalModule],
})
export class AppModule {}
