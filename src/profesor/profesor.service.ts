import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfesorEntity } from './profesor.entity';
import { Long, Repository } from 'typeorm';

@Injectable()
export class ProfesorService {
  constructor(
    @InjectRepository(ProfesorEntity)
    private readonly profesorRepository: Repository<ProfesorEntity>,
  ) {}

  async create(profesor: ProfesorEntity): Promise<ProfesorEntity> {
    if (profesor.extension.toString().length === 5) {
      return await this.profesorRepository.save(profesor);
    } else {
      throw new BadRequestException(
        'El profesor no cumple con los requisitos para ser creado',
      );
    }
  }

  async asignarEvaluador(profesor: ProfesorEntity, idEvaluacion: Long) {
    if (profesor.evaluaciones.length < 3) {
      const evaluacion = await this.profesorRepository.findOne({
        where: { id: idEvaluacion },
      });
      if (!profesor) {
        throw new Error('La evaluacion no existe');
      }
      if (!evaluacion) {
        throw new Error('El profesor no existe');
      }
      profesor.esParEvaluador = true;
      await this.profesorRepository.save(evaluacion);
    } else {
      throw new Error(
        'El profesor no puede ser asignado a más de 3 evaluaciones',
      );
    }
  }

  async findOne(id: Long): Promise<ProfesorEntity> {
    const profesor = await this.profesorRepository.findOne({ where: { id } });
    if (!profesor) {
      throw new BadRequestException('El profesor no existe');
    }
    return profesor;
  }
}
