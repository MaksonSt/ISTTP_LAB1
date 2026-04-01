import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response } from 'express';
import * as ExcelJS from 'exceljs';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const players = await this.playersService.findAll();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Players');

    sheet.columns = [
      { header: 'First Name', key: 'first_name', width: 20 },
      { header: 'Last Name', key: 'last_name', width: 20 },
      { header: 'Position', key: 'position', width: 20 },
      { header: 'Club', key: 'club', width: 25 },
      { header: 'Jersey #', key: 'jersey_number', width: 12 },
      { header: 'Born Year', key: 'born_year', width: 12 },
      { header: 'Salary (USD)', key: 'salary', width: 16 },
    ];
    sheet.getRow(1).font = { bold: true };

    for (const p of players) {
      const currentTeam = p.team_players[p.team_players.length - 1]?.teams;
      sheet.addRow({
        first_name: p.first_name,
        last_name: p.last_name,
        position: p.positions?.name ?? '',
        club: currentTeam?.name ?? '',
        jersey_number: p.jersey_number ?? '',
        born_year: p.born_year ?? '',
        salary: p.salary ? Number(p.salary) : '',
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="players.xlsx"',
    });
    res.send(buffer);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  importExcel(@UploadedFile() file: Express.Multer.File) {
    return this.playersService.importExcel(file.buffer);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.playersService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playersService.findOne(+id);
  }

  @Post()
  create(@Body() body: any) {
    return this.playersService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.playersService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playersService.remove(+id);
  }
}
