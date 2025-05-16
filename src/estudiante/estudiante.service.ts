import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { Long, Repository } from 'typeorm';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async findOne(id: Long): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['proyectos'],
    });

    if (!estudiante) {
      throw new BadRequestException(`Estudiante con ID  no encontrado`);
    }
    return estudiante;
  }

  async create(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    if (estudiante.promedio > 3.2 && estudiante.semestre >= 4) {
      return await this.estudianteRepository.save(estudiante);
    } else if (estudiante.promedio < 3.2) {
      throw new BadRequestException(
        'El estudiante no tiene el promedio necesario',
      );
    } else if (estudiante.semestre < 4) {
      throw new BadRequestException(
        'El estudiante no tiene el semestre necesario',
      );
    } else {
      throw new BadRequestException('No se pudo crear el estudiante');
    }
  }

  async delete(id: Long) {
    try {
      const estudiante = await this.findOne(id);
      if (estudiante.proyectos.length > 0) {
        throw new BadRequestException(
          'El estudiante no puede ser eliminado porque tiene proyectos asociados',
        );
      }
      await this.estudianteRepository.remove(estudiante);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new Error('El estudiante no existe');
      }
      throw error;
    }
  }
}
