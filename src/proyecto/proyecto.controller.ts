import { Controller, Post, Body, Put, Get, Param, UseInterceptors, HttpCode, HttpStatus } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoEntity } from './proyecto.entity';
import { ProyectoDto } from './proyecto.dto';
import { plainToInstance } from 'class-transformer';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { BusinessErrorsInterceptor } from '../shared/Interceptors/business-errors.interceptor';

@Controller('proyecto')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  async create(@Body() proyectoDto: ProyectoDto): Promise<ProyectoEntity> {
    const proyecto = plainToInstance(ProyectoEntity, proyectoDto);
    return await this.proyectoService.create(proyecto);
  }

  @Put(':proyectoId')
  @HttpCode(HttpStatus.OK)
  async avanzarProyecto(
    @Param('proyectoId') proyectoId: string,
  ): Promise<ProyectoEntity> {
    return await this.proyectoService.avanzarProyecto(BigInt(proyectoId));
  }

  @Get(':proyectoId/estudiante')
  async findEstudiantes(
    @Param('proyectoId') proyectoId: string,
  ): Promise<EstudianteEntity> {
    const id = BigInt(proyectoId);
    const estudiante = await this.proyectoService.findEstudiantes(id);
    if (!estudiante) {
      throw new Error('El proyecto no existe');
    }
    return estudiante;
  }
}
