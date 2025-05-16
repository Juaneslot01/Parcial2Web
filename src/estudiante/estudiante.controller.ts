import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { EstudianteDto } from './estudiante.dto';
import { EstudianteEntity } from './estudiante.entity';
import { plainToInstance } from 'class-transformer';
import { EstudianteService } from './estudiante.service';
import { Long } from 'typeorm';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Get(':estudianteId')
  async findOne(
    @Param('estudianteId') estudianteId: Long,
  ): Promise<EstudianteEntity> {
    return await this.estudianteService.findOne(estudianteId);
  }

  @Post()
  async create(
    @Body() estudianteDto: EstudianteDto,
  ): Promise<EstudianteEntity> {
    const estudiante = plainToInstance(EstudianteEntity, estudianteDto);
    return await this.estudianteService.create(estudiante);
  }

  @Delete(':estudianteId')
  @HttpCode(204)
  async delete(@Param('estudianteId') estudianteId: Long) {
    return await this.estudianteService.delete(estudianteId);
  }
}
