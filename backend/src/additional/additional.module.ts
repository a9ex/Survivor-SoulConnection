import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { CompatibilityModule } from './compatibility/compatibility.module';
import { WardrobeModule } from './wardrobe/wardrobe.module';

@Module({
  imports: [DashboardModule, CompatibilityModule, WardrobeModule],
})
export class AdditionalModule {}
