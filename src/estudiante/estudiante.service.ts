import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async create(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    if (estudiante.promedio > 3.2 && estudiante.semestre >= 4) {
      return await this.estudianteRepository.save(estudiante);
    } else {
      throw new Error(
        'El estudiante no cumple con los requisitos para crear un proyecto',
      );
    }
  }

  async delete(id: number) {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
    });
    if (!estudiante) {
      throw new Error('El estudiante no existe');
    }
    if (estudiante?.proyectos.length > 0) {
      throw new Error(
        'El estudiante no puede ser eliminado porque tiene proyectos asociados',
      );
    }
    await this.estudianteRepository.remove(estudiante);
  }
}
