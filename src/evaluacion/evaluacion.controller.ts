import { Controller, Post } from '@nestjs/common';
import { EvaluacionService } from './evaluacion.service';
import { EvaluacionDto } from './evaluacion.dto';
import { Body } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EvaluacionEntity } from './evaluacion.entity';

@Controller('evaluacion')
export class EvaluacionController {
  constructor(private readonly evaluacionService: EvaluacionService) {}

  @Post()
  async create(@Body() evaluacionDto: EvaluacionDto) {
    const evaluacion = plainToInstance(EvaluacionEntity, evaluacionDto);
    return this.evaluacionService.create(evaluacion);
  }
}
