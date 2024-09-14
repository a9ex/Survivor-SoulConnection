import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('events-by-month')
  public async eventsByMonth() {
    return this.dashboardService.eventsByMonth();
  }

  @Get('meetings-top-source')
  public async meetingsTopSource() {
    return this.dashboardService.meetingsTopSource();
  }

  @Get('ratings')
  public async ratings() {
    return this.dashboardService.ratings();
  }

  @Get('astrological-signs')
  public async astrologicalSigns() {
    return this.dashboardService.astrologicalSigns();
  }

  @Get('gender-repartition')
  public async genderRepartition() {
    return this.dashboardService.genderRepartition();
  }
}
