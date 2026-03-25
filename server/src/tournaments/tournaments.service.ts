import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TournamentsService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; season: string; start_date?: string; end_date?: string; country_id: number }) {
    return this.prisma.tournaments.create({ data: {
      name: data.name,
      season: data.season,
      country_id: data.country_id,
      start_date: data.start_date ? new Date(data.start_date) : undefined,
      end_date: data.end_date ? new Date(data.end_date) : undefined,
    }});
  }

  update(id: number, data: { name?: string; season?: string; start_date?: string; end_date?: string; country_id?: number }) {
    return this.prisma.tournaments.update({ where: { id }, data: {
      name: data.name,
      season: data.season,
      country_id: data.country_id,
      start_date: data.start_date ? new Date(data.start_date) : undefined,
      end_date: data.end_date ? new Date(data.end_date) : undefined,
    }});
  }

  remove(id: number) {
    return this.prisma.tournaments.delete({ where: { id } });
  }

  findAll() {
    return this.prisma.tournaments.findMany({
      include: {
        tournament_countries: true,
        _count: { select: { tournament_teams: true, matches: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.tournaments.findUnique({
      where: { id },
      include: {
        tournament_countries: true,
        tournament_teams: {
          include: { teams: { include: { team_cities: true } } },
        },
        matches: {
          orderBy: { match_date: 'desc' },
          include: {
            teams_matches_home_team_idToteams: true,
            teams_matches_away_team_idToteams: true,
          },
        },
      },
    });
  }

  async getStandings(id: number) {
    const tournament = await this.prisma.tournaments.findUnique({
      where: { id },
      include: {
        tournament_teams: { include: { teams: true } },
        matches: {
          include: {
            teams_matches_home_team_idToteams: true,
            teams_matches_away_team_idToteams: true,
          },
        },
      },
    });

    if (!tournament) return null;

    const table: Record<
      number,
      {
        team: { id: number; name: string };
        played: number;
        won: number;
        drawn: number;
        lost: number;
        gf: number;
        ga: number;
        points: number;
      }
    > = {};

    // Initialize from tournament_teams first (teams that may not have played yet)
    for (const tt of tournament.tournament_teams) {
      table[tt.team_id] = {
        team: { id: tt.teams.id, name: tt.teams.name },
        played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0,
      };
    }

    // Also ensure any team appearing in matches is in the table
    for (const m of tournament.matches) {
      if (!table[m.home_team_id]) {
        table[m.home_team_id] = {
          team: { id: m.teams_matches_home_team_idToteams.id, name: m.teams_matches_home_team_idToteams.name },
          played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0,
        };
      }
      if (!table[m.away_team_id]) {
        table[m.away_team_id] = {
          team: { id: m.teams_matches_away_team_idToteams.id, name: m.teams_matches_away_team_idToteams.name },
          played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0,
        };
      }
    }

    for (const m of tournament.matches) {
      const hs = m.home_score ?? 0;
      const as_ = m.away_score ?? 0;
      const home = table[m.home_team_id];
      const away = table[m.away_team_id];

      if (!home || !away) continue;

      home.played++;
      away.played++;
      home.gf += hs;
      home.ga += as_;
      away.gf += as_;
      away.ga += hs;

      if (hs > as_) {
        home.won++;
        home.points += 3;
        away.lost++;
      } else if (hs < as_) {
        away.won++;
        away.points += 3;
        home.lost++;
      } else {
        home.drawn++;
        away.drawn++;
        home.points++;
        away.points++;
      }
    }

    return Object.values(table).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.gf - a.ga;
      const gdB = b.gf - b.ga;
      if (gdB !== gdA) return gdB - gdA;
      return b.gf - a.gf;
    });
  }
}
