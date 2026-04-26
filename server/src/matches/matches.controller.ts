import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MatchesService } from './matches.service';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { role } from '@prisma/client';

@Controller('matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query('tournamentId') tournamentId?: string) {
    return this.matchesService.findAll(
      tournamentId ? +tournamentId : undefined,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([role.ADMIN])
  create(@Body() body: any) {
    return this.matchesService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([role.ADMIN])
  update(@Param('id') id: string, @Body() body: any) {
    return this.matchesService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles([role.ADMIN])
  remove(@Param('id') id: string) {
    return this.matchesService.remove(+id);
  }
}
