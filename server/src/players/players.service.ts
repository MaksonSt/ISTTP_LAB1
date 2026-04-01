import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as ExcelJS from 'exceljs';

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
    const player = await this.prisma.players.update({
      where: { id },
      data: playerData,
    });
    if (team_id !== undefined) {
      await this.prisma.team_players.updateMany({
        where: { player_id: id, left_date: null },
        data: { left_date: new Date() },
      });
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

  async importExcel(
    fileBuffer: Buffer,
  ): Promise<{ created: number; skipped: number }> {
    const workbook = new ExcelJS.Workbook();
    const ab = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength,
    ) as ArrayBuffer;
    await workbook.xlsx.load(ab);
    const sheet = workbook.worksheets[0];

    const [positions, teams] = await Promise.all([
      this.prisma.positions.findMany(),
      this.prisma.teams.findMany(),
    ]);

    const posMap = new Map(positions.map((p) => [p.name.toLowerCase(), p.id]));
    const teamMap = new Map(teams.map((t) => [t.name.toLowerCase(), t.id]));

    const rows: Array<{
      first_name: string;
      last_name: string;
      position_id: number;
      jersey_number?: number;
      born_year?: number;
      salary?: number;
      team_id?: number;
    }> = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const firstName = row.getCell(1).text.trim();
      const lastName = row.getCell(2).text.trim();
      const positionName = row.getCell(3).text.trim().toLowerCase();
      const clubName = row.getCell(4).text.trim().toLowerCase();
      const jerseyRaw = row.getCell(5).value;
      const bornRaw = row.getCell(6).value;
      const salaryRaw = row.getCell(7).value;

      const positionId = posMap.get(positionName);
      if (!firstName || !lastName || !positionId) return;

      rows.push({
        first_name: firstName,
        last_name: lastName,
        position_id: positionId,
        jersey_number: jerseyRaw ? Number(jerseyRaw) : undefined,
        born_year: bornRaw ? Number(bornRaw) : undefined,
        salary: salaryRaw ? Number(salaryRaw) : undefined,
        team_id: clubName ? teamMap.get(clubName) : undefined,
      });
    });

    for (const row of rows) {
      await this.create(row);
    }

    const total = Math.max(0, sheet.actualRowCount - 1);
    return { created: rows.length, skipped: total - rows.length };
  }
}
