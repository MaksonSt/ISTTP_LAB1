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
import { TeamsService } from './teams.service';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { role } from '@prisma/client';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([role.ADMIN])
  create(@Body() body: any) {
    return this.teamsService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([role.ADMIN])
  update(@Param('id') id: string, @Body() body: any) {
    return this.teamsService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([role.ADMIN])
  remove(@Param('id') id: string) {
    return this.teamsService.remove(+id);
  }
}
