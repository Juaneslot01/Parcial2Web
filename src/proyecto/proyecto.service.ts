import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
  ) {}

  async create(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.presupuesto > 0 && proyecto.titulo.length > 15) {
      return await this.proyectoRepository.save(proyecto);
    } else {
      throw new Error(
        'El proyecto no cumple con los requisitos para ser creado',
      );
    }
  }

  async avanzarProyecto(id: number): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });
    if (!proyecto) {
      throw new Error('El proyecto no existe');
    }
    if (proyecto.estado < 4) {
      proyecto.estado = proyecto.estado + 1;
      return await this.proyectoRepository.save(proyecto);
    } else if (proyecto?.estado === 4) {
      throw new Error('El proyecto ya ha sido terminado');
    } else {
      throw new Error('El proyecto no existe');
    }
  }

  /*
    async findAllEstudiantes(): Promise<EstudianteEntity> {
    }*/
}
