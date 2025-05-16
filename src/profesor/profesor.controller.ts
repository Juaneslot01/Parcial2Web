import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { ProfesorDto } from './profesor.dto';
import { plainToInstance } from 'class-transformer';
import { ProfesorEntity } from './profesor.entity';
import { Long } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

@Controller('profesor')
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  async create(@Body() profesorDto: ProfesorDto): Promise<ProfesorEntity> {
    const profesor = plainToInstance(ProfesorEntity, profesorDto);
    return await this.create(profesor);
  }

  @Put(':profesorId/asignar-evaluador')
  async asignarEvaluador(
    @Param('profesorId') profesorId: bigint,
    @Body() profesorDTO: ProfesorDto,
  ): Promise<ProfesorEntity> {
    const profesor = await this.profesorService.findOne(profesorId);

    if (!profesor) {
      throw new BadRequestException('El profesor no existe');
    }
    try {
      return await this.asignarEvaluador(profesorId, profesorDTO);
    } catch {
      throw new BadRequestException('Error al asignar evaluador');
    }
  }
}
