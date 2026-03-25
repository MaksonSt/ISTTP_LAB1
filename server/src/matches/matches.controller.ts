import { Controller, Get, Param, Query } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get()
  findAll(@Query('tournamentId') tournamentId?: string) {
    return this.matchesService.findAll(tournamentId ? +tournamentId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(+id);
  }
}
