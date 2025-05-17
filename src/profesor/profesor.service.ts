import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfesorEntity } from './profesor.entity';
import { Long, Repository } from 'typeorm';
import { EvaluacionEntity } from '../evaluacion/evaluacion.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,
    @InjectRepository(EvaluacionEntity)
    private readonly evaluacionRepository: Repository<EvaluacionEntity>,
  ) {}

  async create(profesor: ProfesorEntity): Promise<ProfesorEntity> {
    if (profesor.extension.toString().length === 5) {
      return await this.profesorRepository.save(profesor);
    } else {
      throw new BusinessLogicException(
        'El profesor no cumple con los requisitos para ser creado',
        BusinessError.BAD_REQUEST,
      );
    }
  }

  async asignarEvaluador(profesorId: bigint, idEvaluacion: bigint): Promise<void> {
    const profesor = await this.profesorRepository.findOne({
      where: { id: profesorId },
      relations: ['evaluaciones'],
    });
    if (!profesor) {
      throw new NotFoundException('El profesor no existe');
    }
    const evaluacion = await this.evaluacionRepository.findOne({
      where: { id: idEvaluacion },
    });
    if (!evaluacion) {
      throw new NotFoundException('La evaluación no existe');
    }
    if (profesor.evaluaciones.length >= 3) {
      throw new BadRequestException(
        'El profesor no puede ser asignado a más de 3 evaluaciones',
      );
    }
    profesor.evaluaciones.push(evaluacion);
    profesor.esParEvaluador = true;
    evaluacion.profesor = profesor;

    await this.profesorRepository.save(profesor);
    await this.evaluacionRepository.save(evaluacion);
  }

  async findOne(id: bigint): Promise<ProfesorEntity> {
    const profesor = await this.profesorRepository.findOne({ where: { id } });
    if (!profesor) {
      throw new BadRequestException('El profesor no existe');
    }
    return profesor;
  }
}
