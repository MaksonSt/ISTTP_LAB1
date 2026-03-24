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

  create(data: {
    first_name: string;
    last_name: string;
    position_id: number;
    salary?: number;
    born_year?: number;
    jersey_number?: number;
  }) {
    return this.prisma.players.create({ data });
  }

  update(
    id: number,
    data: {
      first_name?: string;
      last_name?: string;
      position_id?: number;
      salary?: number;
      born_year?: number;
      jersey_number?: number;
    },
  ) {
    return this.prisma.players.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.players.delete({ where: { id } });
  }
}
