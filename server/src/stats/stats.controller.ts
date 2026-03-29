import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('stats')
export class StatsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAll() {
    const [matchStats, matches, players] = await Promise.all([
      this.prisma.match_stats.findMany({
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
      }),
      this.prisma.matches.findMany({
        include: {
          teams_matches_home_team_idToteams: true,
          teams_matches_away_team_idToteams: true,
        },
      }),
      this.prisma.players.findMany({
        include: { positions: true },
      }),
    ]);

    // Top scorers
    const scorerMap: Record<
      number,
      { id: number; name: string; team: string; goals: number; assists: number }
    > = {};
    for (const s of matchStats) {
      if (!scorerMap[s.player_id]) {
        const tp = s.players.team_players[0];
        scorerMap[s.player_id] = {
          id: s.player_id,
          name: `${s.players.first_name} ${s.players.last_name}`,
          team: tp ? tp.teams.name : '—',
          goals: 0,
          assists: 0,
        };
      }
      scorerMap[s.player_id].goals += s.goals ?? 0;
      scorerMap[s.player_id].assists += s.assists ?? 0;
    }
    const topScorers = Object.values(scorerMap)
      .filter((p) => p.goals > 0)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10);

    // Goals by team
    const teamGoals: Record<number, { name: string; scored: number; conceded: number }> = {};
    for (const m of matches) {
      const hid = m.home_team_id;
      const aid = m.away_team_id;
      if (!teamGoals[hid])
        teamGoals[hid] = { name: m.teams_matches_home_team_idToteams.name, scored: 0, conceded: 0 };
      if (!teamGoals[aid])
        teamGoals[aid] = { name: m.teams_matches_away_team_idToteams.name, scored: 0, conceded: 0 };
      teamGoals[hid].scored += m.home_score ?? 0;
      teamGoals[hid].conceded += m.away_score ?? 0;
      teamGoals[aid].scored += m.away_score ?? 0;
      teamGoals[aid].conceded += m.home_score ?? 0;
    }
    const goalsByTeam = Object.values(teamGoals).sort((a, b) => b.scored - a.scored);

    // Players by position
    const posMap: Record<string, number> = {};
    for (const p of players) {
      const pos = p.positions.name;
      posMap[pos] = (posMap[pos] ?? 0) + 1;
    }
    const playersByPosition = Object.entries(posMap).map(([position, count]) => ({
      position,
      count,
    }));

    return { topScorers, goalsByTeam, playersByPosition };
  }
}
