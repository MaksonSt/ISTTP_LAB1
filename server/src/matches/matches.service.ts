import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  findAll(tournamentId?: number) {
    return this.prisma.matches.findMany({
      where: tournamentId ? { tournament_id: tournamentId } : undefined,
      orderBy: { match_date: 'desc' },
      include: {
        tournaments: true,
        teams_matches_home_team_idToteams: true,
        teams_matches_away_team_idToteams: true,
        referees: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.matches.findUnique({
      where: { id },
      include: {
        tournaments: true,
        teams_matches_home_team_idToteams: true,
        teams_matches_away_team_idToteams: true,
        referees: true,
        match_stats: {
          orderBy: { goals: 'desc' },
          include: {
            players: {
              include: {
                positions: true,
                team_players: {
                  where: { left_date: null },
                  include: { teams: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  }
}
