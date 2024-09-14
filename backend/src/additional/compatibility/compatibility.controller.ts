import { Controller, Get } from '@nestjs/common';
import { CompatibilityService } from './compatibility.service';

@Controller('compatibility')
export class CompatibilityController {
  constructor(private readonly compatibilityService: CompatibilityService) {}

  @Get('customers')
  async getCustomers() {
    return this.compatibilityService.getCustomers();
  }
}
