import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  findAll(search?: string) {
    return this.prisma.players.findMany({
      where: search
        ? {
            OR: [
              { first_name: { contains: search, mode: 'insensitive' } },
              { last_name: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        positions: true,
        team_players: {
          include: { teams: true },
          orderBy: { joined_date: 'asc' },
        },
      },
      orderBy: { last_name: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.players.findUnique({
      where: { id },
      include: {
        positions: true,
        team_players: { include: { teams: true } },
        match_stats: {
          include: { matches: true },
        },
      },
    });
  }

  async create(data: {
    first_name: string;
    last_name: string;
    position_id: number;
    salary?: number;
    born_year?: number;
    jersey_number?: number;
    team_id?: number;
  }) {
    const { team_id, ...playerData } = data;
    const player = await this.prisma.players.create({ data: playerData });
    if (team_id) {
      await this.prisma.team_players.create({
        data: { player_id: player.id, team_id, joined_date: new Date() },
      });
    }
    return player;
  }

  async update(
    id: number,
    data: {
      first_name?: string;
      last_name?: string;
      position_id?: number;
      salary?: number;
      born_year?: number;
      jersey_number?: number;
      team_id?: number;
    },
  ) {
    const { team_id, ...playerData } = data;
    const player = await this.prisma.players.update({ where: { id }, data: playerData });
    if (team_id !== undefined) {
      // Close current club
      await this.prisma.team_players.updateMany({
        where: { player_id: id, left_date: null },
        data: { left_date: new Date() },
      });
      // Assign new club
      if (team_id) {
        await this.prisma.team_players.create({
          data: { player_id: id, team_id, joined_date: new Date() },
        });
      }
    }
    return player;
  }

  remove(id: number) {
    return this.prisma.players.delete({ where: { id } });
  }
}
