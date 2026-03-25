import { Module } from '@nestjs/common';
import { MetaController } from './meta.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MetaController],
  providers: [PrismaService],
})
export class MetaModule {}
