import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionDto } from './evaluacion.dto';
import { Body } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EvaluacionEntity } from './evaluacion.entity';
import { BusinessErrorsInterceptor } from '../shared/Interceptors/business-errors.interceptor';

@Controller('evaluacion')
@UseInterceptors(BusinessErrorsInterceptor)
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Post()
  async create(@Body() evaluacionDto: EvaluacionDto) {
    const evaluacion = plainToInstance(EvaluacionEntity, evaluacionDto);
    return this.evaluacionService.create(evaluacion);
  }
}
