import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TournamentsService } from './tournaments.service';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { role } from '@prisma/client';

@Controller('tournaments')
export class TournamentsController {
  constructor(private tournamentsService: TournamentsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.tournamentsService.findOne(+id);
  }

  @Get(':id/standings')
  @UseGuards(AuthGuard('jwt'))
  getStandings(@Param('id') id: string) {
    return this.tournamentsService.getStandings(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([role.ADMIN])
  create(@Body() body: any) {
    return this.tournamentsService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([role.ADMIN])
  update(@Param('id') id: string, @Body() body: any) {
    return this.tournamentsService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([role.ADMIN])
  remove(@Param('id') id: string) {
    return this.tournamentsService.remove(+id);
  }
}
