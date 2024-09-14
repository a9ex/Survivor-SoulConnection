import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UnauthorizedException,
  Post,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { PatchCustomerDTO, PostCustomerDTO } from './customers.dto';
import { AuthenticatedRequest } from 'src/core/auth/auth.guard';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  public async getCustomers(@Request() req: AuthenticatedRequest) {
    if (req.role === 'coach') return this.customersService.getCoachCustomers(req.user.id);
    return this.customersService.getCustomers();
  }

  @Get(':id')
  public async getCustomerById(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    if (req.role === 'coach') return this.customersService.getCoachCustomerById(req.user.id, id);
    return this.customersService.getCustomerById(id);
  }

  @Patch(':id')
  public async patchCustomer(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: PatchCustomerDTO
  ) {
    if (req.role === 'admin') return this.customersService.patchCustomer(id, data);
    if (req.role === 'coach') return this.customersService.patchCoachCustomer(req.user.id, id, data);
    throw new UnauthorizedException();
  }

  @Delete(':id')
  public async deleteCustomer(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    if (req.role === 'admin') return this.customersService.deleteCustomer(id);
    if (req.role === 'coach') return this.customersService.deleteCustomer(id, req.user.id);
    throw new UnauthorizedException();
  }

  @Post()
  public async createCustomer(@Request() req: AuthenticatedRequest, @Body() data: PostCustomerDTO) {
    if (req.role === 'admin') return this.customersService.createCustomer(data);
    if (req.role === 'coach') return this.customersService.createCustomer(data, req.user.id);
    throw new UnauthorizedException();
  }
}
