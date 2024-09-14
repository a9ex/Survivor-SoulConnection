import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { WardrobeService } from './wardrobe.service';

@Controller('wardrobe')
export class WardrobeController {
  constructor(private readonly wardrobeService: WardrobeService) {}

  @Get('customers')
  public async getCustomers() {
    return this.wardrobeService.getCustomers();
  }

  @Get('customers/:customerId')
  public async getCustomerClothes(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.wardrobeService.getCustomerClothes(customerId);
  }
}
