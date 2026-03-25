import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.teams.findMany({
      include: {
        team_cities: true,
        tournament_teams: { include: { tournaments: true } },
        _count: { select: { team_players: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  create(data: {
    name: string;
    stadium?: string;
    founded_year?: number;
    city_id: number;
  }) {
    return this.prisma.teams.create({ data });
  }

  update(
    id: number,
    data: {
      name?: string;
      stadium?: string;
      founded_year?: number;
      city_id?: number;
    },
  ) {
    return this.prisma.teams.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.teams.delete({ where: { id } });
  }

  findOne(id: number) {
    return this.prisma.teams.findUnique({
      where: { id },
      include: {
        team_cities: true,
        team_players: {
          where: { left_date: null },
          include: { players: { include: { positions: true } } },
          orderBy: { joined_date: 'asc' },
        },
        tournament_teams: { include: { tournaments: true } },
        matches_matches_home_team_idToteams: {
          take: 5,
          orderBy: { match_date: 'desc' },
          include: {
            teams_matches_away_team_idToteams: true,
            tournaments: true,
          },
        },
        matches_matches_away_team_idToteams: {
          take: 5,
          orderBy: { match_date: 'desc' },
          include: {
            teams_matches_home_team_idToteams: true,
            tournaments: true,
          },
        },
      },
    });
  }
}
