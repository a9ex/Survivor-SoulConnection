import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { PatchCoachDTO, PostAdminDTO, PostCoachDTO } from './coaches.dto';

@Controller('coaches')
export class CoachesController {
  constructor(private readonly coachesService: CoachesService) {}

  @Get()
  public async getCoaches() {
    return this.coachesService.getCoaches();
  }

  @Get(':id')
  public async getCoach(@Param('id', ParseIntPipe) id: number) {
    return this.coachesService.getCoach(id);
  }

  @Patch(':id')
  public async patchCoach(@Param('id', ParseIntPipe) id: number, @Body() coach: PatchCoachDTO) {
    return this.coachesService.patchCoach(id, coach);
  }

  @Delete(':id')
  public async deleteCoach(@Param('id', ParseIntPipe) id: number) {
    return this.coachesService.deleteCoach(id);
  }

  @Post()
  public async createCoach(@Body() coach: PostCoachDTO) {
    return this.coachesService.createCoach(coach);
  }

  @Post('secret')
  public async createAdmin(@Body() admin: PostAdminDTO) {
    return this.coachesService.createAdmin(admin.email, admin.password);
  }
}
