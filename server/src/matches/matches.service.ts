import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  create(data: { tournament_id: number; home_team_id: number; away_team_id: number; match_date: string; home_score?: number; away_score?: number; referee_id?: number }) {
    return this.prisma.matches.create({ data: {
      tournament_id: data.tournament_id,
      home_team_id: data.home_team_id,
      away_team_id: data.away_team_id,
      match_date: new Date(data.match_date),
      home_score: data.home_score,
      away_score: data.away_score,
      referee_id: data.referee_id || null,
    }});
  }

  update(id: number, data: { tournament_id?: number; home_team_id?: number; away_team_id?: number; match_date?: string; home_score?: number; away_score?: number; referee_id?: number }) {
    return this.prisma.matches.update({ where: { id }, data: {
      tournament_id: data.tournament_id,
      home_team_id: data.home_team_id,
      away_team_id: data.away_team_id,
      match_date: data.match_date ? new Date(data.match_date) : undefined,
      home_score: data.home_score,
      away_score: data.away_score,
      referee_id: data.referee_id || null,
    }});
  }

  remove(id: number) {
    return this.prisma.matches.delete({ where: { id } });
  }

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
