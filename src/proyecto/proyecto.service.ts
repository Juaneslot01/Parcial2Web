import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(ProyectoEntity)
    private readonly proyectoRepository: Repository<ProyectoEntity>,
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
  ) {}

  async create(proyecto: ProyectoEntity): Promise<ProyectoEntity> {
    if (proyecto.presupuesto > 0 && proyecto.titulo.length > 15) {
      return await this.proyectoRepository.save(proyecto);
    } else if (proyecto.presupuesto <= 0) {
      throw new BadRequestException(
        'El proyecto no cumple con el presupuesto requerido',
      );
    } else if (proyecto.titulo.length < 15) {
      throw new BadRequestException(
        'El titulo del proyecto no cumple con el requisito',
      );
    } else {
      throw new BadRequestException('El proyecto no existe');
    }
  }

  async avanzarProyecto(id: Long): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });
    if (!proyecto) {
      throw new Error('El proyecto no existe');
    }
    if (proyecto.estado < 4) {
      proyecto.estado = proyecto.estado + 1;
      return await this.proyectoRepository.save(proyecto);
    } else if (proyecto?.estado === 4) {
      throw new BadRequestException('El proyecto ya ha sido terminado');
    } else {
      throw new BadRequestException('El proyecto no existe');
    }
  }
  //Cambie este metodo porque solo existe un estudiante segun el uml
  async findEstudiantes(proyectoId: Long): Promise<EstudianteEntity | null> {
    const estudiante = this.estudianteRepository.findOne({
      where: { proyectos: { id: proyectoId } },
      relations: ['proyectos'],
    });
    if (!estudiante) {
      throw new BadRequestException('El proyecto no existe');
    }
    return estudiante;
  }
}
