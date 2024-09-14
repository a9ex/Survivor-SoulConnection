import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Req } from '@nestjs/common';
import { UpdateProfileDTO } from 'src/core/auth/auth.dto';
import { AuthenticatedRequest } from 'src/core/auth/auth.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // /me endpoint
  @Get('me')
  @HttpCode(200)
  async profile(@Req() req: AuthenticatedRequest) {
    return this.profileService.profile(req.user);
  }

  @Patch('me')
  @HttpCode(200)
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() body: UpdateProfileDTO) {
    return this.profileService.updateProfile(req.user, body);
  }

  @Delete('me')
  @HttpCode(200)
  async deleteProfile(@Req() req: AuthenticatedRequest) {
    return this.profileService.deleteProfile(req.user);
  }

  // /:id endpoint
  @Get(':id')
  @HttpCode(200)
  async profileById(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.profileService.profileById(req.user, id);
  }

  @Patch(':id')
  @HttpCode(200)
  async updateProfileById(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProfileDTO
  ) {
    return this.profileService.updateProfileById(req.user, id, body);
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteProfileById(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.profileService.deleteProfileById(req.user, id);
  }
}
