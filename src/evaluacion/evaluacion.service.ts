import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionEntity } from './evaluacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
  ) {}

  async create(evaluacion: EvaluacionEntity): Promise<EvaluacionEntity> {
    if (evaluacion.calificacion < 5 && evaluacion.calificacion > 0) {
      return await this.evaluacionRepository.save(evaluacion);
    } else {
      throw new Error(
        'La evaluación no cumple con los requisitos para ser creada',
      );
    }
  }
}
