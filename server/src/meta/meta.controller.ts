import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';

@Controller('meta')
export class MetaController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAll() {
    const [positions, cities, countries, referees, teams, tournaments] =
      await Promise.all([
        this.prisma.positions.findMany({ orderBy: { name: 'asc' } }),
        this.prisma.team_cities.findMany({ orderBy: { name: 'asc' } }),
        this.prisma.tournament_countries.findMany({ orderBy: { name: 'asc' } }),
        this.prisma.referees.findMany({ orderBy: { last_name: 'asc' } }),
        this.prisma.teams.findMany({
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        }),
        this.prisma.tournaments.findMany({
          select: { id: true, name: true, season: true },
          orderBy: { name: 'asc' },
        }),
      ]);
    return { positions, cities, countries, referees, teams, tournaments };
  }
}
