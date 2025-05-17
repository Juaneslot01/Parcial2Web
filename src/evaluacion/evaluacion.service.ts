import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvaluacionEntity } from './evaluacion.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class EvaluacionService {
  constructor(
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
  ) {}

  async create(evaluacion: EvaluacionEntity): Promise<EvaluacionEntity> {
    if (evaluacion.calificacion <= 5 && evaluacion.calificacion > 0) {
      return await this.evaluacionRepository.save(evaluacion);
    } else {
      throw new BusinessLogicException(
        'La evaluación no cumple con los requisitos para ser creada',
        BusinessError.BAD_REQUEST,
      );
    }
  }
}
