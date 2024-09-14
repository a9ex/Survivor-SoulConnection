import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { CoachesModule } from './coaches/coaches.module';
import { CustomersModule } from './customers/customers.module';
import { TipsModule } from './tips/tips.module';
import { EventsModule } from './events/events.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [ProfileModule, CoachesModule, CustomersModule, TipsModule, EventsModule, BlogModule],
})
export class FeaturesModule {}
