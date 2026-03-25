import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { PlayersModule } from './players/players.module';
import { TeamsModule } from './teams/teams.module';
import { TournamentsModule } from './tournaments/tournaments.module';

@Module({
  imports: [PlayersModule, TeamsModule, TournamentsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
