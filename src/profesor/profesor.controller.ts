import { Body, Controller, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ProfesorService } from './profesor.service';
import { ProfesorDto } from './profesor.dto';
import { plainToInstance } from 'class-transformer';
import { ProfesorEntity } from './profesor.entity';
import { BadRequestException } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/Interceptors/business-errors.interceptor';

@Controller('profesor')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProfesorController {
  constructor(private readonly profesorService: ProfesorService) {}

  @Post()
  async create(@Body() profesorDto: ProfesorDto): Promise<ProfesorEntity> {
    const profesor = plainToInstance(ProfesorEntity, profesorDto);
    return await this.profesorService.create(profesor);
  }

  @Put(':profesorId/evaluacion/:evaluacionId')
  async asignarEvaluador(
    @Param('profesorId') profesorId: string,
    @Param('evaluacionId') evaluacionId: string,
  ): Promise<{message: string}> {
    try {
      await this.profesorService.asignarEvaluador(BigInt(profesorId), BigInt(evaluacionId));
      return { message: 'Evaluación asignada correctamente' };  
    } catch (error) { 
      if (error instanceof BadRequestException) {
        return { message: error.message };
      }
      throw error;
    }
  }
}
