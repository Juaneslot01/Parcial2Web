import { Controller, Post, Body, Put, Get, Param } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoEntity } from './proyecto.entity';
import { ProyectoDto } from './proyecto.dto';
import { plainToInstance } from 'class-transformer';

@Controller('proyecto')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  async create(@Body() proyectoDto: ProyectoDto): Promise<ProyectoEntity> {
    const proyecto = plainToInstance(ProyectoEntity, proyectoDto);
    return await this.create(proyecto);
  }

  @Put(':proyectoId')
  async avanzarProyecto(
    @Param('proyectoId') proyectoId: string,
    @Body() proyectoDto: ProyectoDto,
  ): Promise<ProyectoEntity> {
    const proyecto = plainToInstance(ProyectoEntity, proyectoDto);
    return await this.avanzarProyecto(proyectoId, proyecto);
  }

  @Get(':proyectoId')
  async findEstudiantes(
    @Param('proyectoId') proyectoId: string,
  ): Promise<any[]> {
    return await this.findEstudiantes(proyectoId);
  }
}
