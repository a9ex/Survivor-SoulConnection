import { Body, Controller, Delete, Get, HttpCode, NotImplementedException, Patch, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedRequest, Public } from './auth.guard';
import { AuthDTO, UpdateProfileDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: AuthDTO) {
    return this.authService.login(body.email, body.password);
  }

  // No @Public() decorator here, internal registration
  @Post('register')
  @HttpCode(201)
  async register(@Body() body: AuthDTO) {
    throw new NotImplementedException('Register is not implemented');
  }
}
