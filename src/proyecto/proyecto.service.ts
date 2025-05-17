import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Long, Repository } from 'typeorm';
import { ProyectoEntity } from './proyecto.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

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
      throw new BusinessLogicException(
        'El proyecto no cumple con el presupuesto requerido',
        BusinessError.BAD_REQUEST,
      );
    } else if (proyecto.titulo.length < 15) {
      throw new BusinessLogicException(
        'El titulo del proyecto no cumple con el requisito',
        BusinessError.BAD_REQUEST,
      );
    } else {
      throw new BadRequestException('El proyecto no existe');
    }
  }

  async avanzarProyecto(id: bigint): Promise<ProyectoEntity> {
    const proyecto = await this.proyectoRepository.findOne({ where: { id } });
    if (!proyecto) {
      throw new Error('El proyecto no existe');
    }
    if (proyecto.estado < 4) {
      proyecto.estado = proyecto.estado + 1;
      return await this.proyectoRepository.save(proyecto);
    } else {
      throw new BusinessLogicException(
        'El proyecto ya ha sido terminado',
        BusinessError.PRECONDITION_FAILED
      );
    }
  }
  //Cambie este metodo porque solo existe un estudiante segun el uml
  async findEstudiantes(proyectoId: bigint): Promise<EstudianteEntity | null> {
    const estudiante = this.estudianteRepository.findOne({
      where: { proyectos: { id: proyectoId } },
      relations: ['proyectos'],
    });
    if (!estudiante) {
      throw new BusinessLogicException(
        'El proyecto no existe',
        BusinessError.BAD_REQUEST,
      );
    }
    return estudiante;
  }
}
